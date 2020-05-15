GOOGLE_PROJECT_ID=vivid-outcome-277104

# The service currently reads from the "Ingredients" tab in the Google Sheet
# https://docs.google.com/spreadsheets/d/1rcj3SbeK_VcMOBrwwdAksJXQVoHTZHRzVOBO8A3X148/edit#gid=0
# Feel free to make a copy of that sheet and adapt it and the code to your needs.

gcloud builds submit --tag gcr.io/$GOOGLE_PROJECT_ID/dante-terapia \
  --project=$GOOGLE_PROJECT_ID

gcloud beta run deploy dante-terapia \
  --image gcr.io/$GOOGLE_PROJECT_ID/dante-terapia \
  --platform managed \
  --region us-central1 \
  --project=$GOOGLE_PROJECT_ID