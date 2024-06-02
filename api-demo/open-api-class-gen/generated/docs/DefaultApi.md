# ExpressionApi.DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**expressionsGet**](DefaultApi.md#expressionsGet) | **GET** /expressions | Get a list of expressions



## expressionsGet

> [Expression] expressionsGet()

Get a list of expressions

### Example

```javascript
import ExpressionApi from 'expression_api';

let apiInstance = new ExpressionApi.DefaultApi();
apiInstance.expressionsGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**[Expression]**](Expression.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

