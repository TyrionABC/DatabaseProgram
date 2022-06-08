package com.service;

import com.domain.Belong;
import com.domain.Direction;
import com.domain.Reference;

import java.util.List;

public interface BelongService {
    List<Belong> getAllById(String id);
    List<Belong> getAllByDirection(String directionName);
    void deleteBelongs(Belong belong);
    void insertBelong(Belong belong);
    List<Belong> getAll();
    Belong selectBelong(Belong belong);
    void update(String id, List<String> directions);
}
