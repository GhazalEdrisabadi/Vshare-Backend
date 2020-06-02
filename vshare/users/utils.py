import logging
import boto3
from botocore.exceptions import ClientError
from django.conf import settings


def create_presigned_url(bucket_name, object_name, expiration=3600):

    s3_client = boto3.client(
      's3',
      aws_access_key_id = 'minio',
      aws_secret_access_key = 'miniostorage',
      endpoint_url = 'http://localhost:9000',
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
      endpoint_url = 'http://localhost:9000',
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