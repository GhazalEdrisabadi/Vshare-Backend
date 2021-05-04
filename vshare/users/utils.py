import logging
import boto3
from botocore.exceptions import ClientError
from django.conf import settings
from django.core.mail import EmailMessage
from django.template import Context
from django.template.loader import render_to_string, get_template

class Util:
    @staticmethod
    def send_email(data):

        ctx = {
        'user': data['user_name'],
        'url' : data['email_body'],
        }

        message = get_template('verify.html').render(ctx)

        msg = EmailMessage(subject=data['email_subject'], body=message, to=[data['to_email']],)
        msg.content_subtype = "html"  # Main content is now text/html
        msg.send()

        #email = EmailMessage(subject=data['email_subject'], body=data['email_body'], to=[data['to_email']])
        #email.send()

def create_presigned_url(bucket_name, object_name, expiration=3600):

    s3_client = boto3.client(
      's3',
      aws_access_key_id = 'minio',
      aws_secret_access_key = 'miniostorage',
      endpoint_url = 'http://185.204.197.168:9000',
    )

    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    return response


def create_presigned_post(bucket_name, object_name,
                          fields=None, conditions=None, expiration=3600):
   
    s3_client = boto3.client(
      's3',
      aws_access_key_id = 'minio',
      aws_secret_access_key = 'miniostorage',
      endpoint_url = 'http://185.204.197.168:9000',
    )


    try:
        response = s3_client.generate_presigned_post(bucket_name,
                                                     object_name,
                                                     Fields=fields,
                                                     Conditions=conditions,
                                                     ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    return response