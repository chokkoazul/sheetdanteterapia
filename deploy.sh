GOOGLE_PROJECT_ID=vivid-outcome-277104

gcloud builds submit --tag gcr.io/$GOOGLE_PROJECT_ID/alertas-misviajes:1.0 \
  --project=$GOOGLE_PROJECT_ID

gcloud beta run deploy alertas-misviajes \
  --image gcr.io/$GOOGLE_PROJECT_ID/alertas-misviajes:1.0 \
  --platform managed \
  --region us-central1 \
  --project=$GOOGLE_PROJECT_ID
