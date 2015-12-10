package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.ServiceBranch;
import com.beautifulyears.domain.User;
import com.beautifulyears.repository.ServiceBranchRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;

@Controller
@RequestMapping("/serviceBranch")
public class ServiceBranchController {
	
	private static ServiceBranchRepository staticServiceBranchRepository;
	private static MongoTemplate staticMongoTemplate;
	
	@Autowired
	public ServiceBranchController(ServiceBranchRepository serviceBranchRepository,
			MongoTemplate mongoTemplate) {
		staticServiceBranchRepository = serviceBranchRepository;
		staticMongoTemplate = mongoTemplate;
	}
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/getRelated" }, produces = { "application/json" })
	@ResponseBody
	public Object getRelatedService(
			@RequestParam(value = "id", required = true) String id) {
		ServiceBranch serviceBranch = staticServiceBranchRepository.findById(id);
		List<ServiceBranch> serviceBranches = staticServiceBranchRepository
				.findByUserId(serviceBranch.getUserId());
		Map<String, List<ServiceBranch>> serviceMap = new HashMap<String, List<ServiceBranch>>();
		for (ServiceBranch serviceBranch2 : serviceBranches) {
			if (null != serviceBranch2.getBasicBranchInfo().getPrimaryUserAddress()
					&& serviceMap.get(serviceBranch2.getBasicBranchInfo().getPrimaryUserAddress()
							.getCity()) != null) {
				serviceMap.get(serviceBranch2.getBasicBranchInfo().getPrimaryUserAddress().getCity())
						.add(serviceBranch2);
			} else if (null != serviceBranch2.getBasicBranchInfo().getPrimaryUserAddress()) {
				List<ServiceBranch> cityList = new ArrayList<ServiceBranch>();
				cityList.add(serviceBranch2);
				serviceMap.put(serviceBranch2.getBasicBranchInfo().getPrimaryUserAddress().getCity(),
						cityList);
			} else {
				List<ServiceBranch> cityList = serviceMap.get(null);
				if (cityList != null) {
					cityList.add(serviceBranch2);
				} else {
					cityList = new ArrayList<ServiceBranch>();
					cityList.add(serviceBranch2);
				}
				serviceMap.put(null, cityList);
			}
		}
		return BYGenericResponseHandler.getResponse(serviceMap);
	};
	
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
		oldService.setUserId(newService.getUserId());

	}
}
