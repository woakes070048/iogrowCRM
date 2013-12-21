#!/usr/bin/python
# Copyright 2013 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

"""All request handlers of PhotoHunt, including its built-in API."""
import httplib2
import model
import json
import os
import random
import string
import apiclient
import webapp2
import datetime
from webapp2_extras import jinja2
import re
from apiclient.discovery import build
from google.appengine.ext import ndb
from google.appengine.api import urlfetch
from google.appengine.api.app_identity import get_default_version_hostname
import oauth2client
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
from oauth2client.tools import run
from webapp2_extras import sessions
import jinja2
from webapp2_extras import i18n
from google.appengine.api import users
from google.appengine.api import memcache
from iomodels.crmengine.shows import Show

jinja_environment = jinja2.Environment(
  loader=jinja2.FileSystemLoader(os.getcwd()),
  extensions=['jinja2.ext.i18n'],cache_size=0)

jinja_environment.install_gettext_translations(i18n)

CLIENT_ID = json.loads(
    open('client_secrets.json', 'r').read())['web']['client_id']

SCOPES = [
    'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar'
]

VISIBLE_ACTIONS = [
    'http://schemas.google.com/AddActivity',
    'http://schemas.google.com/ReviewActivity'
]

TOKEN_INFO_ENDPOINT = ('https://www.googleapis.com/oauth2/v1/tokeninfo' +
    '?access_token=%s')
TOKEN_REVOKE_ENDPOINT = 'https://accounts.google.com/o/oauth2/revoke?token=%s'

class BaseHandler(webapp2.RequestHandler):
    def set_user_locale(self):
        # Get user's Localization settings
        locale = self.request.GET.get('locale', 'en_US')
        i18n.get_i18n().set_locale('en')
      



   

class SessionEnabledHandler(webapp2.RequestHandler):
  """Base type which ensures that derived types always have an HTTP session."""
  CURRENT_USER_SESSION_KEY = 'me'

  def dispatch(self):
    """Intercepts default request dispatching to ensure that an HTTP session
    has been created before calling dispatch in the base type.
    """
    # Get a session store for this request.
    self.session_store = sessions.get_store(request=self.request)
    try:
      # Dispatch the request.
      webapp2.RequestHandler.dispatch(self)
    finally:
      # Save all sessions.
      self.session_store.save_sessions(self.response)

  @webapp2.cached_property
  def session(self):
    """Returns a session using the default cookie key."""
    return self.session_store.get_session()

  def get_user_from_session(self):
    """Convenience method for retrieving the users crendentials from an
    authenticated session.
    """
    google_user_id = self.session.get(self.CURRENT_USER_SESSION_KEY)
    if google_user_id is None:
      raise UserNotAuthorizedException('Session did not contain user id.')
    user = model.User.query(model.User.google_user_id == google_user_id).get()
    
    #if not user:
    # raise UserNotAuthorizedException(
    #   'Session user ID could not be found in the datastore.')
    return user


class UserNotAuthorizedException(Exception):
  msg = 'Unauthorized request.'

class NotFoundException(Exception):
  msg = 'Resource not found.'

class RevokeException(Exception):
  msg = 'Failed to revoke token for given user.'




class SignInHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
        
        
        # Set the user locale from user's settings
        self.set_user_locale()
        user_id = self.request.get('id')
            # Render the template
        template_values = {'CLIENT_ID': CLIENT_ID,
                               'ID' : user_id
                              }
        template = jinja_environment.get_template('templates/sign-in.html')
        self.response.out.write(template.render(template_values))
          
class SignUpHandler(BaseHandler, SessionEnabledHandler):
    
    @staticmethod
    def init_drive_folder(http,folder_name,parent=None):
      """Return the public Google+ profile data for the given user."""
      
      driveservice = build('drive', 'v2', http=http)
      
      folder = {
                'title': folder_name,
                'mimeType': 'application/vnd.google-apps.folder'          
      }
      if parent:
        folder['parents'] = [{'id': parent}]
      try:
        created_folder = driveservice.files().insert(body=folder).execute()
        return created_folder['id']
      except errors.HttpError, error:
        print 'An error occured: %s' % error
        return None   
      
      
    def get(self):
          if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
        
        
            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            
            template_values = {
              'userinfo': user,
              'CLIENT_ID': CLIENT_ID}
            template = jinja_environment.get_template('templates/sign-up.html')
            self.response.out.write(template.render(template_values))
          else:
            self.redirect('/sign-in')
    def post(self):
        if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            org_name = self.request.get('org_name')
            mob_phone = self.request.get('mob_phone')
            # init organization folders in Google drive
            credentials = user.google_credentials
            http = credentials.authorize(httplib2.Http(memcache))
            org_folder = self.init_drive_folder(http,org_name+' (ioGrow)')
            accounts_folder = self.init_drive_folder(http,'Accounts', org_folder)
            contacts_folder = self.init_drive_folder(http,'Contacts', org_folder)
            leads_folder = self.init_drive_folder(http,'Leads', org_folder)
            opportunities_folder = self.init_drive_folder(http,'Opportunities', org_folder)
            cases_folder = self.init_drive_folder(http,'Cases', org_folder)
            shows_folder = self.init_drive_folder(http,'Shows', org_folder)
            products_folder = self.init_drive_folder(http,'Products', org_folder)
            organization = model.Organization(name=org_name,
                                              org_folder=org_folder,
                                              accounts_folder=accounts_folder,
                                              contacts_folder=contacts_folder,
                                              leads_folder=leads_folder,
                                              opportunities_folder=opportunities_folder,
                                              cases_folder=cases_folder,
                                              shows_folder=shows_folder,
                                              products_folder=products_folder)
            organization.put()
            profile = model.Profile.query(model.Profile.name=='Super Administrator', model.Profile.organization==organization.key).get()
            user.init_user_config(organization.key,profile.key)
            self.redirect('/')
        else:
            self.redirect('/sign-in')
class AccountListHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'ME':user.google_user_id,'tabs':tabs}
            template = jinja_environment.get_template('templates/accounts/list.html')
            self.response.out.write(template.render(template_values))

class AccountShowHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'ME':user.google_user_id,
             'tabs':tabs}
            template = jinja_environment.get_template('templates/accounts/show.html')
            self.response.out.write(template.render(template_values))
class ContactListHandler(BaseHandler, SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values = {'ME':user.google_user_id,
             'tabs':tabs}
      template = jinja_environment.get_template('templates/contacts/list.html')
      self.response.out.write(template.render(template_values))
class ContactShowHandler(BaseHandler,SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values={'tabs':tabs}
      template = jinja_environment.get_template('templates/contacts/show.html')
      self.response.out.write(template.render(template_values))
class OpportunityListHandler(BaseHandler,SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values = {'ME':user.google_user_id,
             'tabs':tabs}
      template = jinja_environment.get_template('templates/opportunities/list.html')
      self.response.out.write(template.render(template_values))
class OpportunityShowHandler(BaseHandler,SessionEnabledHandler):
  def get (self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values={'tabs':tabs}
      template = jinja_environment.get_template('templates/opportunities/opportunity_show.html')
      self.response.out.write(template.render(template_values))

class LeadListHandler(BaseHandler,SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values = {'tabs':tabs}
      template = jinja_environment.get_template('templates/leads/lead_list.html')
      self.response.out.write(template.render(template_values))
class LeadShowHandler(BaseHandler,SessionEnabledHandler):
  def get (self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values={'tabs':tabs}
      template = jinja_environment.get_template('templates/leads/lead_show.html')
      self.response.out.write(template.render(template_values))

class CaseListHandler(BaseHandler,SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values = {'tabs':tabs}
      template = jinja_environment.get_template('templates/cases/case_list.html')
      self.response.out.write(template.render(template_values))
class CaseShowHandler(BaseHandler,SessionEnabledHandler):
  def get (self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values={'tabs':tabs}
      template = jinja_environment.get_template('templates/cases/case_show.html')
      self.response.out.write(template.render(template_values))
class CampaignListHandler(BaseHandler,SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values = {'tabs':tabs}
      template = jinja_environment.get_template('templates/campaigns/campaign_list.html')
      self.response.out.write(template.render(template_values))
class CampaignShowHandler(BaseHandler,SessionEnabledHandler):
  def get (self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values={'tabs':tabs}
      template = jinja_environment.get_template('templates/campaigns/campaign_show.html')
      self.response.out.write(template.render(template_values))
class NoteShowHandler (BaseHandler,SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values={'tabs':tabs}
      template = jinja_environment.get_template('templates/accounts/note_show.html')
      self.response.out.write(template.render(template_values))

class DocumentShowHandler(BaseHandler,SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values={'tabs':tabs}
      template = jinja_environment.get_template('templates/documents/show.html')
      self.response.out.write(template.render(template_values))


class TaskShowHandler(BaseHandler, SessionEnabledHandler):
  def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/activities/task_show.html')
            self.response.out.write(template.render(template_values))
class EventShowHandler(BaseHandler, SessionEnabledHandler):
  def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/activities/event_show.html')
            self.response.out.write(template.render(template_values))
class ProductListHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/products/list.html')
            self.response.out.write(template.render(template_values))
class RoadMapListHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/products/roadmaps/list.html')
            self.response.out.write(template.render(template_values))
class FeatureListHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/products/features/list.html')
            self.response.out.write(template.render(template_values))
class FeatureShowHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}

            template = jinja_environment.get_template('templates/products/features/show.html')
            self.response.out.write(template.render(template_values))
class ShowListHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/live/shows/list_show.html')
            self.response.out.write(template.render(template_values))
class ShowShowHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/live/shows/show.html')
            self.response.out.write(template.render(template_values))
class UserListHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/admin/users/list.html')
            self.response.out.write(template.render(template_values))

class GroupListHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/admin/groups/list.html')
            self.response.out.write(template.render(template_values))

class GroupShowHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/admin/groups/show.html')
            self.response.out.write(template.render(template_values))
class settingsShowHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/admin/settings/settings.html')
            self.response.out.write(template.render(template_values))
class CompanyProfileHandlers(BaseHandler,SessionEnabledHandler):
  def get(self):
    if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
      user = self.get_user_from_session()
      self.set_user_locale()
      tabs = user.get_user_active_tabs()
      self.set_user_locale()
      template_values = {'tabs':tabs}
      template = jinja_environment.get_template('templates/live/company_profile/comp_profile_list.html')
      self.response.out.write(template.render(template_values))

class GooglePlusConnect(SessionEnabledHandler):
    @staticmethod
    def exchange_code(code):
      """Exchanges the `code` member of the given AccessToken object, and returns
      the relevant credentials.

      Args:
        code: authorization code to exchange.

      Returns:
        Credentials response from Google indicating token information.

      Raises:
        FlowExchangeException Failed to exchange code (code invalid).
      """
      oauth_flow = flow_from_clientsecrets('client_secrets.json',
        scope=SCOPES)
      oauth_flow.request_visible_actions = ' '.join(VISIBLE_ACTIONS)
      oauth_flow.redirect_uri = 'postmessage'
      credentials = oauth_flow.step2_exchange(code)
      return credentials
    @staticmethod
    def get_token_info(credentials):
      """Get the token information from Google for the given credentials."""
      url = (TOKEN_INFO_ENDPOINT
             % credentials.access_token)
      return urlfetch.fetch(url)

    @staticmethod
    def get_user_profile(credentials):
      """Return the public Google+ profile data for the given user."""
      http = httplib2.Http()
      plus = build('plus', 'v1', http=http)
      credentials.authorize(http)
      return plus.people().get(userId='me').execute()
    @staticmethod
    def get_user_email(credentials):
      """Return the public Google+ profile data for the given user."""
      http = httplib2.Http()
      userinfo = build('oauth2', 'v1', http=http)
      credentials.authorize(http)
      return userinfo.userinfo().get().execute()

    @staticmethod
    def save_token_for_user(google_user_id, credentials,user_id=None):
      """Creates a user for the given ID and credential or updates the existing
      user with the existing credential.

      Args:
        google_user_id: Google user ID to update.
        credentials: Credential to set for the user.

      Returns:
        Updated User.
      """
      if user_id:
        user = model.User.get_by_id(user_id)
        profile = GooglePlusConnect.get_user_profile(credentials)
        email = GooglePlusConnect.get_user_email(credentials)
        user.status = 'active'
        user.google_user_id = profile.get('id')
        user.google_display_name = profile.get('displayName')
        user.google_public_profile_url = profile.get('url')
        user.email = email.get('email')
        image = profile.get('image')
        if image is not None:
          user.google_public_profile_photo_url = image.get('url')
      else:
        user = model.User.query(model.User.google_user_id == google_user_id).get()     
      #user = model.User.all().filter('google_user_id =', google_user_id).get()
      
      if user is None:
        
        # Couldn't find User in datastore.  Register a new user.
        profile = GooglePlusConnect.get_user_profile(credentials)
        email = GooglePlusConnect.get_user_email(credentials)

        user = model.User()
        user.type = 'business_user'
        user.status = 'active'
        user.google_user_id = profile.get('id')
        user.google_display_name = profile.get('displayName')
        user.google_public_profile_url = profile.get('url')
        user.email = email.get('email')
        image = profile.get('image')
        if image is not None:
          user.google_public_profile_photo_url = image.get('url')
      user.google_credentials = credentials
      user.put()
      return user

  
    def post(self):
        #try to get the user credentials from the code
        credentials = None
        code = self.request.get("code")
        try:
            credentials = GooglePlusConnect.exchange_code(code)
        except FlowExchangeError:
            return
        token_info = GooglePlusConnect.get_token_info(credentials)
        if token_info.status_code != 200:
            return
        token_info = json.loads(token_info.content)
        # If there was an error in the token info, abort.
        if token_info.get('error') is not None:
            return
        # Make sure the token we got is for our app.
        expr = re.compile("(\d*)(.*).apps.googleusercontent.com")
        issued_to_match = expr.match(token_info.get('issued_to'))
        local_id_match = expr.match(CLIENT_ID)
        if (not issued_to_match
            or not local_id_match
            or issued_to_match.group(1) != local_id_match.group(1)):
          
            return

        
        
        
        
        #Check if is it an invitation to sign-in or just a simple sign-in 
        invited_user_id = None
        invited_user_id_request = self.request.get("id")
        if invited_user_id_request:
            invited_user_id = long(invited_user_id_request)
        #user = model.User.query(model.User.google_user_id == token_info.get('user_id')).get()
        
        # Store our credentials with in the datastore with our user.
        if invited_user_id:

          user = GooglePlusConnect.save_token_for_user(token_info.get('user_id'),
                                                  credentials,invited_user_id)
        else:

          user = GooglePlusConnect.save_token_for_user(token_info.get('user_id'),
                                                  credentials)
        # if user doesn't have organization redirect him to sign-up
        isNewUser = False
        if user.organization is None:
            isNewUser = True

        # Store the user ID in the session for later use.
        self.session[self.CURRENT_USER_SESSION_KEY] = token_info.get('user_id')
        self.response.headers['Content-Type'] = 'application/json'  
        self.response.out.write(json.dumps(isNewUser))

class PublicUsersHandler(SessionEnabledHandler):
    @staticmethod
    def save_token_for_user(google_user_id, credentials):
      """Creates a user for the given ID and credential or updates the existing
      user with the existing credential.

      Args:
        google_user_id: Google user ID to update.
        credentials: Credential to set for the user.

      Returns:
        Updated User.
      """
      user = model.User.query(model.User.google_user_id == google_user_id).get()     
      if user is None:
        
        # Couldn't find User in datastore.  Register a new user.
        profile = GooglePlusConnect.get_user_profile(credentials)
        email = GooglePlusConnect.get_user_email(credentials)

        user = model.User()
        user.type = 'public_user'
        user.status = 'active'
        user.google_user_id = profile.get('id')
        user.google_display_name = profile.get('displayName')
        user.google_public_profile_url = profile.get('url')
        user.email = email.get('email')
        image = profile.get('image')
        if image is not None:
          user.google_public_profile_photo_url = image.get('url')
      user.google_credentials = credentials
      user.put()
      return user

  
    def post(self):
        #try to get the user credentials from the code
        credentials = None
        code = self.request.get("code")
        try:
            credentials = GooglePlusConnect.exchange_code(code)
        except FlowExchangeError:
            return
        token_info = GooglePlusConnect.get_token_info(credentials)
        if token_info.status_code != 200:
            return
        token_info = json.loads(token_info.content)
        # If there was an error in the token info, abort.
        if token_info.get('error') is not None:
            return
        # Make sure the token we got is for our app.
        expr = re.compile("(\d*)(.*).apps.googleusercontent.com")
        issued_to_match = expr.match(token_info.get('issued_to'))
        local_id_match = expr.match(CLIENT_ID)
        if (not issued_to_match
            or not local_id_match
            or issued_to_match.group(1) != local_id_match.group(1)):
          
            return
        user = PublicUsersHandler.save_token_for_user(token_info.get('user_id'),
                                                  credentials)
        # if user doesn't have organization redirect him to sign-up
        userinfo = {}
        userinfo['display_name']= user.google_display_name
        userinfo['google_user_id'] = user.google_user_id
        userinfo['google_public_profile_url']= user.google_public_profile_url
        userinfo['photo'] = user.google_public_profile_photo_url

        # Store the user ID in the session for later use.
        self.session[self.CURRENT_USER_SESSION_KEY] = token_info.get('user_id')
        self.response.headers['Content-Type'] = 'application/json'  
        self.response.out.write(json.dumps(userinfo))


class SearchListHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
      if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # Set the user locale from user's settings
            self.set_user_locale()
            tabs = user.get_user_active_tabs()

            # Set the user locale from user's settings
            self.set_user_locale()
            # Render the template
            template_values = {'tabs':tabs}
            template = jinja_environment.get_template('templates/search/list.html')
            self.response.out.write(template.render(template_values))
class PublicLiveHomeHandler(BaseHandler, SessionEnabledHandler):
    def get(self):
            # Render the template
            user = None
            if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
                try:
                    user = self.get_user_from_session()
                except:
                    user = None

            template_values = {'user': user}
            template = jinja_environment.get_template('templates/live/live_index.html')
            self.response.out.write(template.render(template_values))
class PublicLiveCompanyPageHandler(BaseHandler, SessionEnabledHandler):
    def get(self,id):
      
            
            # Render the template
            template_values = {}
            template = jinja_environment.get_template('templates/live/live_company_page.html')
            self.response.out.write(template.render(template_values))
class PublicLiveShowHandler(BaseHandler, SessionEnabledHandler):
    def get(self,id):
            show_id = int(id)
            show = Show.get_by_id(show_id)
            if show.is_published:
                # Render the template
                organization_key = show.organization
                organization_id = organization_key.id()
                template_values = {'organization_id':organization_id, 'show': show}
                template = jinja_environment.get_template('templates/live/live_show_page.html')
                self.response.out.write(template.render(template_values))

class IndexHandler(BaseHandler,SessionEnabledHandler):
  def get(self):
        
        # Check if the user is loged-in, if not redirect him to the sign-in page
        if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            try:
                user = self.get_user_from_session()
                if user is None:
                    self.redirect('/sign-in')
                    return
                # Set the user locale from user's settings
                self.set_user_locale()
                apps = user.get_user_apps()
                admin_app = None
                
                active_app = user.get_user_active_app()
                for app in apps:
                    if app.name=='admin':
                        admin_app = app
                
                logout_url = users.create_logout_url('/sign-in')

                template_values = {

                  'user':user,
                  'logout_url' : logout_url,
                  'CLIENT_ID': CLIENT_ID,
                  'active_app':active_app,
                  'apps': apps,
                }
                if admin_app:
                    template_values['admin_app']=admin_app
                template = jinja_environment.get_template('templates/base.html')
                self.response.out.write(template.render(template_values))
            except UserNotAuthorizedException as e:
                self.redirect('/sign-in')
        else:
            self.redirect('/sign-in')

# Change the current app for example from sales to customer support           
class ChangeActiveAppHandler(SessionEnabledHandler):
  
  def get(self,appid):
        new_app_id = int(appid)
        if self.session.get(SessionEnabledHandler.CURRENT_USER_SESSION_KEY) is not None:
            user = self.get_user_from_session()
            # get the active application before the change request
            active_app = user.get_user_active_app()
            new_active_app = model.Application.get_by_id(new_app_id)
            if new_active_app:
              if new_active_app.organization==user.organization:
                future = user.set_user_active_app(new_active_app.key)
                # To-do resolve this: we are waiting for the active_app to be refreshed
                #time.sleep(1)
                self.redirect(new_active_app.url)
                future.get_result()
              else:
                self.redirect('/error')
            else:
              self.redirect('/')

            
        else:
            self.redirect('/sign-in')
           
        




def get_base_url():
  """Returns the base URL for this application."""
  base = get_default_version_hostname()
  if "appspot.com" in base:
    return "https://%s" % base
  return "http://%s" % base

routes = [
    ('/',IndexHandler),
    
    # Templates Views Routes
    # Accounts Views
    ('/views/accounts/list',AccountListHandler),
    ('/views/accounts/show',AccountShowHandler),
    # Contacts Views
    ('/views/contacts/list',ContactListHandler),
    ('/views/contacts/show',ContactShowHandler),
    # Shows Views
    ('/views/shows/list',ShowListHandler),
    ('/views/shows/show',ShowShowHandler),
    # Lean Product Dev views
    ('/views/products/list',ProductListHandler),
    ('/views/roadmaps/list',RoadMapListHandler),
    ('/views/features/list',FeatureListHandler),
    ('/views/features/show',FeatureShowHandler),
    # Opportunities Views
    ('/views/opportunities/list',OpportunityListHandler),
    ('/views/opportunities/show',OpportunityShowHandler),
    # Leads Views
    ('/views/leads/list',LeadListHandler),
    ('/views/leads/show',LeadShowHandler),
    # Cases Views
    ('/views/cases/list',CaseListHandler),
    ('/views/cases/show',CaseShowHandler),
    # Campaings Views
    ('/views/campaigns/list',CampaignListHandler),
    ('/views/campaigns/show',CampaignShowHandler),
    # Notes, Documents, Taks, Events, Search Views
    ('/views/notes/show',NoteShowHandler),
    ('/views/documents/show',DocumentShowHandler),
    
    ('/views/search/list',SearchListHandler),
    ('/views/tasks/show',TaskShowHandler),
    ('/views/events/show',EventShowHandler),
    # Admin Console Views
    ('/views/admin/users/list',UserListHandler),
    ('/views/admin/groups/list',GroupListHandler),
    ('/views/admin/groups/show',GroupShowHandler),
    ('/views/admin/settings',settingsShowHandler),
    #iogrow live App
    ('/views/live/company_profile',CompanyProfileHandlers),
    # Applications settings
    (r'/apps/(\d+)', ChangeActiveAppHandler),
    # ioGrow Live
    ('/live',PublicLiveHomeHandler),
    (r'/live/companies/(\d+)',PublicLiveCompanyPageHandler),
    (r'/live/shows/(\d+)',PublicLiveShowHandler),
    # Authentication Handlers
    ('/sign-in',SignInHandler),
    ('/sign-up',SignUpHandler),
    ('/gconnect',GooglePlusConnect),
    ('/gconnectpublic',PublicUsersHandler)
    ]
config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'YOUR_SESSION_SECRET'
}
app = webapp2.WSGIApplication(routes, config=config, debug=True)

