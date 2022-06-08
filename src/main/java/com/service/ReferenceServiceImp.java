package com.service;

import com.dao.PaperMapper;
import com.dao.ReferenceMapper;
import com.domain.Reference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ReferenceServiceImp implements ReferenceService{
    @Autowired
    private ReferenceMapper referenceMapper;
    @Override
    public List<Reference> getAllById(String id) {
        return referenceMapper.getAllReferences(id);
    }

    @Override
    public void deleteReferences(Reference reference) {
        if(reference.getId()!=null&&reference.getReferPaperId()!=null)
            referenceMapper.deleteReference(reference.getId(),reference.getReferPaperId());
        else if(reference.getId()!=null)
            referenceMapper.deleteReferenceById(reference.getId());
        else
            referenceMapper.deleteReferenceByReferId(reference.getReferPaperId());
    }

    @Override
    public void insertReference(Reference reference) {
        referenceMapper.insert(reference);
    }

    @Override
    public List<Reference> getAll() {
        return referenceMapper.selectList(null);
    }

    @Override
    public Reference selectReference(Reference reference) {
        return referenceMapper.selectReference(reference.getId(),reference.getReferPaperId());
    }

    @Override
    public void update(String id,List<String> referIds) {
        referenceMapper.deleteReferenceById(id);
        for (String referId : referIds) {
            referenceMapper.insert(new Reference(id, referId));
        }
    }

}
