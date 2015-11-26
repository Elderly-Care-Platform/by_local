package com.beautifulyears.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.beautifulyears.domain.ServiceBranch;
import com.beautifulyears.repository.custom.ServiceBranchRepositoryCustom;

public interface ServiceBranchRepository extends 
	MongoRepository<ServiceBranch, Serializable>, ServiceBranchRepositoryCustom{
	public List<ServiceBranch> findAll();
	public List<ServiceBranch> findByUserId(String userId);

	public ServiceBranch findById(String id);
}
