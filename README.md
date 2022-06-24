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
