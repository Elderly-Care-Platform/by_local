package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;

import com.beautifulyears.domain.ServiceBranch;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.ServiceBranchRepository;

@Controller
public class ServiceBranchController {
	
	private static ServiceBranchRepository staticServiceBranchRepository;
	private static MongoTemplate staticMongoTemplate;
	
	@Autowired
	public ServiceBranchController(ServiceBranchRepository serviceBranchRepository,
			MongoTemplate mongoTemplate) {
		staticServiceBranchRepository = serviceBranchRepository;
		staticMongoTemplate = mongoTemplate;
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
		}

		for (ServiceBranch addedBranches : newlyAdded) {
			addedBranches.setUserId(user.getId());
			ServiceBranch newBranch = new ServiceBranch();
			updateServiceBranch(newBranch, addedBranches);
			staticMongoTemplate.save(newBranch);
			serviceBranches.set(serviceBranches.indexOf(addedBranches), newBranch);
		}

		for (ServiceBranch updatedBranch : updated) {
			ServiceBranch old = existingBranches.get(existingBranches
					.indexOf(updatedBranch));
			updateServiceBranch(old, updatedBranch);
			old.setLastModifiedAt(new Date());
			staticMongoTemplate.save(old);
		}
		
		return serviceBranches;
	}
	
	private static void updateServiceBranch(ServiceBranch oldService,
			ServiceBranch newService) {
		
		oldService.setBasicBranchInfo(newService.getBasicBranchInfo());
		oldService.setServiceProviderInfo(newService.getServiceProviderInfo());

	}
}
