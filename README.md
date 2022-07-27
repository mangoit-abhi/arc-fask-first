Welcome Arc Lab 42

#### Instructions ###

1. Update main.py file 
   i. Change Host 
   ii. Change debug = false

2. Update config.py file
   i. Change debug = false

3. Update WP data feed url (live site url) in View.py >> landing()

4. Update "app.config['MAIL_USERNAME']" with your mail id and app.config['MAIL_PASSWORD'] with your password.


# ARC Launchpad codebase

This webapp includes:

- An ARC testing interface for humans.
- An ARC task editor that can save data to a GCP datastore.


## Running the app locally

```shell
pip install -r requirements.txt
python main.py
```

To run the app locally while using the task saving button, you will also need access
to a GCP datastore. Otherwise you can simply use the task download button to save your tasks
to local disk.

## Deploying the app to AppEngine

```shell
gcloud app deploy
```
