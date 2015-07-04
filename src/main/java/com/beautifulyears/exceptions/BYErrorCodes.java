/**
 * 
 */
package com.beautifulyears.exceptions;

/**
 * @author Nitin
 *
 */
public enum BYErrorCodes {
		  INVALID_REQUEST(1001, "The request is invalid"),
		  MISSING_PARAMETER(1002, "Required query parameter is missing"),
		  INTERNAL_SERVER_ERROR(1003,"Some unknown internal server error occured"),
		  
		  
		  DISCUSS_NOT_FOUND(2001,"Discuss content with provided discussId doesn't exist")
		  
		  ;

		  private final int id;
		  private final String msg;

		  BYErrorCodes(int id, String msg) {
		    this.id = id;
		    this.msg = msg;
		  }

		  public int getId() {
		    return this.id;
		  }

		  public String getMsg() {
		    return this.msg;
		  }
}
