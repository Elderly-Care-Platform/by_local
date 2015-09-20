/**
 * 
 */
package com.beautifulyears.util.activityLogHandler;

import java.util.Date;

import org.jsoup.Jsoup;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.ActivityLog;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.User;
import com.beautifulyears.util.Util;

/**
 * @author Nitin
 *
 */
public class DiscussActivityLogHandler extends ActivityLogHandler<Discuss> {

	public DiscussActivityLogHandler(MongoTemplate mongoTemplate) {
		super(mongoTemplate);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected ActivityLog getEntityObject(Discuss discuss, int crudType,
			User currentUser, String details) {
		ActivityLog log = new ActivityLog();
		if (discuss != null) {
			log.setActivityTime(new Date());
			int discussType = ActivityLogConstants.ACTIVITY_TYPE_POST;
			if ("Q".equals(discuss.getDiscussType())) {
				discussType = ActivityLogConstants.ACTIVITY_TYPE_QUESTION;
			} else if ("P".equals(discuss.getDiscussType())) {
				discussType = ActivityLogConstants.ACTIVITY_TYPE_POST;
			}else if ("F".equals(discuss.getDiscussType())) {
				discussType = ActivityLogConstants.ACTIVITY_TYPE_FEEDBACK;
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
				log.setCurrentUserEmailId(currentUser.getEmail());
			}
		}
		return log;
	}
	
	private String getDiscussTitle(Discuss discuss){
		String title = "----";
		
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