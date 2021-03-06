/**
 * 
 */
package com.beautifulyears.util.activityLogHandler;

import java.util.Date;

import org.jsoup.Jsoup;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.User;
import com.beautifulyears.util.Util;

/**
 * @author Nitin
 *
 */
public class SharedActivityLogHandler extends ActivityLogHandler<Object> {

	public SharedActivityLogHandler(MongoTemplate mongoTemplate) {
		super(mongoTemplate);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected ActivityLog getEntityObject(Object entity, int crudType,
			User currentUser, String details) {
		ActivityLog log = new ActivityLog();
		if (entity != null && entity instanceof Discuss) {
			Discuss discuss = (Discuss)entity;
			log.setActivityTime(new Date());
			int discussType = ActivityLogConstants.ACTIVITY_TYPE_SHARED_POST;
			if ("Q".equals(discuss.getDiscussType())) {
				discussType = ActivityLogConstants.ACTIVITY_TYPE_SHARED_QUESTION;
			} else if ("P".equals(discuss.getDiscussType())) {
				discussType = ActivityLogConstants.ACTIVITY_TYPE_SHARED_POST;
			}
			
			log.setActivityType(discussType);
			log.setCrudType(crudType);
			log.setDetails("discuss id = " + discuss.getId() + "  "
					+ (details == null ? "" : details));
			log.setEntityId(discuss.getId());
			log.setRead(false);
			log.setTitleToDisplay(getDiscussTitle(discuss));
			if (null != currentUser) {
				log.setUserId(currentUser.getId());
				if(currentUser.getUserIdType() == BYConstants.USER_ID_TYPE_EMAIL){
					log.setCurrentUserEmailId(currentUser.getEmail());
				}else if(currentUser.getUserIdType() == BYConstants.USER_ID_TYPE_PHONE){
					log.setCurrentUserEmailId(currentUser.getPhoneNumber());
				}
			}
		}
		return log;
	}
	
	private String getDiscussTitle(Discuss discuss){
		String title = "-------";
		
		if(!Util.isEmpty(discuss.getTitle())){
			title = discuss.getTitle();
		}else if(null != discuss.getLinkInfo()){
			if(!Util.isEmpty(discuss.getLinkInfo().getTitle())){
				title = discuss.getLinkInfo().getTitle();
			}else if(!Util.isEmpty(discuss.getLinkInfo().getDescription())){
				title = discuss.getLinkInfo().getDescription();
			}
		}else if(!Util.isEmpty(discuss.getText())){
			org.jsoup.nodes.Document doc = Jsoup.parse(discuss.getText());
			String domText = doc.text();
			title = domText;
			if (domText.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH) {
				title = domText;
			}
		}
		
		return Util.truncateText(title);
	}
}
