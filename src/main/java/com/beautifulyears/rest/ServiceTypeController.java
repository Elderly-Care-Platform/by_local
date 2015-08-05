package com.beautifulyears.rest;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.ServiceTypes;
import com.beautifulyears.repository.ServiceTypesRepository;
import com.beautifulyears.rest.response.ServiceTypesResponse;
import com.beautifulyears.util.LoggerUtil;

/**
 * The REST based service for managing "service_types"
 * 
 * @author jharana
 *
 */
@Controller
@RequestMapping({ "service_types" })
public class ServiceTypeController {

	private ServiceTypesRepository serviceTypesRepository;

	@Autowired
	public ServiceTypeController(ServiceTypesRepository serviceTypesRepository) {
		this.serviceTypesRepository = serviceTypesRepository;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = "/list/all", produces = { "application/json" })
	@ResponseBody
	public Map<Integer, ServiceTypesResponse.ServiceTypesEntity> findAll() {
		LoggerUtil.logEntry();
		ServiceTypesResponse res = new ServiceTypesResponse();
		List<ServiceTypes> list = this.serviceTypesRepository.findByIsActive(new Boolean(true));
		res.addServiceTypes(list);
		return res.getResponse();
	}

	@RequestMapping(method = { RequestMethod.POST }, value = "/insertAll", consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> insert(@RequestBody List<ServiceTypes> serviceTypesArray) {
		LoggerUtil.logEntry();
		serviceTypesRepository.save(serviceTypesArray);
		ResponseEntity<Void> responseEntity = new ResponseEntity<Void>(
				HttpStatus.CREATED);
		return responseEntity;
	}

	@RequestMapping(method = { RequestMethod.POST }, value = "/linkAll", consumes = { "application/json" })
	@ResponseBody
	public ResponseEntity<Void> link(@RequestBody List<String> linksArray) {
		LoggerUtil.logEntry();
		for (Iterator<String> iterator = linksArray.iterator(); iterator
				.hasNext();) {
			String linkString = (String) iterator.next();
			String parent = linkString.split(":")[0];
			String child = linkString.split(":")[1];

			if (null != parent && null != child) {

				ServiceTypes parentServiceTypes = serviceTypesRepository.findByServiceTypeName(parent);
				ServiceTypes childServiceTypes = serviceTypesRepository.findByServiceTypeName(child);

				if (null != parentServiceTypes && null != childServiceTypes) {
					parentServiceTypes.getChildren().add(childServiceTypes.getId());
					childServiceTypes.setParentId(parentServiceTypes.getId());

					serviceTypesRepository.save(parentServiceTypes);
					serviceTypesRepository.save(childServiceTypes);
				} else {
					System.out.println("mandatory parameters missing");
				}
			} else {
				System.out.println("No entry matched for the combination of "
						+ parent + "and " + child);
			}
		}

		ResponseEntity<Void> responseEntity = new ResponseEntity<Void>(
				HttpStatus.CREATED);
		return responseEntity;
	}

}
