/**
 * 
 */
package com.beautifulyears.util.activityLogHandler;

import java.util.Date;

import org.springframework.data.mongodb.core.MongoTemplate;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.domain.ServiceBranch;
import com.beautifulyears.domain.User;

/**
 * @author Nitin
 *
 */
public class ServiceBranchLogHandler extends ActivityLogHandler<ServiceBranch> {

	public ServiceBranchLogHandler(MongoTemplate mongoTemplate) {
		super(mongoTemplate);
	}


	@Override
	protected ActivityLog getEntityObject(ServiceBranch serviceBranch, int crudType,
			User currentUser, String details) {
		ActivityLog log = new ActivityLog();
		if (serviceBranch != null) {
			log.setActivityTime(new Date());
			log.setActivityType(ActivityLogConstants.ACTIVITY_TYPE_SERVICE);
			log.setCrudType(crudType);
			log.setDetails("userProfile id = " + serviceBranch.getId() + "  "
					+ (details == null ? "" : details));
			log.setEntityId(serviceBranch.getUserId());
			log.setRead(false);
			log.setTitleToDisplay(serviceBranch.getId());
			if (null != currentUser) {
				log.setUserId(currentUser.getId());
				if(currentUser.getRegType() == BYConstants.REGISTRATION_TYPE_EMAIL){
					log.setCurrentUserEmailId(currentUser.getEmail());
				}else if(currentUser.getRegType() == BYConstants.REGISTRATION_TYPE_PHONE){
					log.setCurrentUserEmailId(currentUser.getPhoneNumber());
				}
			}
		}
		return log;
	}
}
