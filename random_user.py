import requests
import json

headers = {'Content-Type':'application/json',
			'Authorization': 'Bearer ya29.ewDdI_8-8jioofa5V13wv0znMI2_--YlPIT7lXPiHd0CzN5odl5nSsgE',
			'User-Agent':'Google APIs Explorer'
}

for x in xrange(1,20):
	generate_users = requests.get("http://api.randomuser.me/")
	users = ((json.loads(generate_users.text))['results'])[0]
	base = (users['user'])
	#email = base['email']
	picture = base['picture']
	last = (base['name'])['last']
	first = (base['name'])['first']

	payload = {
				   "firstname":first.title(),
				   "lastname":last.title(),
				   "profile_img_url":picture
			  }
  	add_contacts = requests.post("http://localhost:8090/_ah/api/crmengine/v1/leads/insertv2",data=json.dumps(payload),headers=headers)
  	print add_contacts.status_code