def success_response(data=None, message="Success"):
    """
    Create a standardized success response
    """
    response = {"success": True}
    
    if data is not None:
        response["data"] = data
    
    if message:
        response["message"] = message
    
    return response


def error_response(error_code=None, message="An error occurred"):
    """
    Create a standardized error response
    """
    response = {"success": False}
    
    error_info = {}
    if error_code:
        error_info["code"] = error_code
    if message:
        error_info["message"] = message
    
    response["error"] = error_info
    return response