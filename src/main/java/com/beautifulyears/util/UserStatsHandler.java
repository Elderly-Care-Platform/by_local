/**
 * 
 */
package com.beautifulyears.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.beautifulyears.domain.UserActivityStats;

/**
 * @author Nitin
 *
 */
public class UserStatsHandler implements Runnable {

	private MongoTemplate mongoTemplate;
	private UserActivityStats stats;

	@Autowired
	public UserStatsHandler(MongoTemplate mongoTemplate) {
		super();
		this.mongoTemplate = mongoTemplate;
	}

	@Override
	public void run() {
		this.mongoTemplate.save(stats);
	}

	public void setStats(UserActivityStats stats) {
		this.stats = stats;
	}

}
