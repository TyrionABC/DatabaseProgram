package com.service;

import com.domain.Reference;

import java.util.List;

public interface ReferenceService {
    List<Reference> getAllById(String id);
    void deleteReferences(Reference reference);
    void insertReference(Reference reference);
    List<Reference> getAll();
    Reference selectReference(Reference reference);
    void update(String id,List<String> referIds);
}
