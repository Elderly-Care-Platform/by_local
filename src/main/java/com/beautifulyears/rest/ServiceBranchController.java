package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.domain.ServiceBranch;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.ServiceBranchRepository;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.ServiceBranchLogHandler;

@Controller
public class ServiceBranchController {
	
	private static ServiceBranchRepository staticServiceBranchRepository;
	private static MongoTemplate staticMongoTemplate;
	private static ActivityLogHandler<ServiceBranch> branchLogHandler;
	
	@Autowired
	public ServiceBranchController(ServiceBranchRepository serviceBranchRepository,
			MongoTemplate mongoTemplate) {
		staticServiceBranchRepository = serviceBranchRepository;
		staticMongoTemplate = mongoTemplate;
		branchLogHandler = new ServiceBranchLogHandler(mongoTemplate);
	}
	
	public static List<ServiceBranch> addServiceBranches(
			List<ServiceBranch> serviceBranches, User user) {
		List<ServiceBranch> existingBranches = staticServiceBranchRepository
				.findByUserId(user.getId());

		ArrayList<ServiceBranch> newlyAdded = new ArrayList<ServiceBranch>(
				serviceBranches);
		newlyAdded.removeAll(existingBranches);

		ArrayList<ServiceBranch> removed = new ArrayList<ServiceBranch>(
				existingBranches);
		removed.removeAll(serviceBranches);

		ArrayList<ServiceBranch> updated = new ArrayList<ServiceBranch>(
				serviceBranches);
		updated.retainAll(existingBranches);

		for (ServiceBranch removedBranches : removed) {
			staticMongoTemplate.remove(removedBranches);
			branchLogHandler.addLog(removedBranches,
					ActivityLogConstants.CRUD_TYPE_DELETE, null, user);
		}

		for (ServiceBranch addedBranches : newlyAdded) {
			addedBranches.setUserId(user.getId());
			ServiceBranch newBranch = new ServiceBranch();
			updateServiceBranch(newBranch, addedBranches);
			staticMongoTemplate.save(newBranch);
			branchLogHandler.addLog(newBranch,
					ActivityLogConstants.CRUD_TYPE_CREATE, null, user);
			serviceBranches.set(serviceBranches.indexOf(addedBranches), newBranch);
		}

		for (ServiceBranch updatedBranch : updated) {
			ServiceBranch old = existingBranches.get(existingBranches
					.indexOf(updatedBranch));
			updateServiceBranch(old, updatedBranch);
			old.setLastModifiedAt(new Date());
			staticMongoTemplate.save(old);
			branchLogHandler.addLog(old, ActivityLogConstants.CRUD_TYPE_UPDATE, null,
					user);
		}
		
		return serviceBranches;
	}
	
	private static void updateServiceBranch(ServiceBranch oldService,
			ServiceBranch newService) {
		
		oldService.setBasicBranchInfo(newService.getBasicBranchInfo());
		oldService.setServiceProviderInfo(newService.getServiceProviderInfo());
		oldService.setUserId(newService.getUserId());

	}
}
