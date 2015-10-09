/**
 * 
 */
package com.beautifulyears.util;

import java.util.ArrayList;
import java.util.List;

import com.beautifulyears.constants.UserTypes;

/**
 * @author Nitin
 *
 */
public class UserProfilePrivacyHandler {
	public static List<String> getPublicFields(int userType){
		List<String> fields = new ArrayList<String>();
		switch(userType){
		case UserTypes.UNSPECIFIED:
		case UserTypes.INDIVIDUAL_CAREGIVER:
		case UserTypes.INDIVIDUAL_ELDER:
		case UserTypes.INDIVIDUAL_VOLUNTEER:
		case UserTypes.INSTITUTION_HOUSING:
		case UserTypes.INSTITUTION_SERVICES:
		case UserTypes.INSTITUTION_PRODUCTS:
		case UserTypes.INSTITUTION_NGO:
		case UserTypes.INDIVIDUAL_PROFESSIONAL:
		default:
			fields = getInstitutionalPublicFields();
		}
		
		
		return fields;
	}
	
	private static List<String> getInstitutionalPublicFields(){
		List<String> fields = new ArrayList<String>();
		fields.add("id");
		fields.add("userId");
		fields.add("userTypes");
		fields.add("basicProfileInfo");
		fields.add("individualInfo");
		fields.add("serviceProviderInfo");
		fields.add("tags");
		fields.add("isFeatured");
		fields.add("createdAt");
		fields.add("lastModifiedAt");
		fields.add("systemTags");
		fields.add("userTags");
		fields.add("status");
		fields.add("reviewedBy");
		fields.add("ratedBy");
		fields.add("aggrRatingPercentage");
		fields.add("verified");
		return fields;
	}
}
