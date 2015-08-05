package com.beautifulyears.repository;


import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.beautifulyears.domain.ServiceTypes;

@Repository
public interface ServiceTypesRepository extends PagingAndSortingRepository<ServiceTypes, String>{
	public List<ServiceTypes> findAll();
	
	public ServiceTypes findByServiceTypeName(String serviceTypeName);
	
	public List<ServiceTypes> findByIsActive(Boolean isActive);

	
}