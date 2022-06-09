package com.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dao.NoteAndFileMapper;
import com.domain.Note_and_extra_file;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteAndFileServiceImp implements NoteAndFileService{
    @Autowired
    private NoteAndFileMapper noteAndFileMapper;
    @Override
    public void insert(Note_and_extra_file note_and_extra_file) {
        note_and_extra_file.setOverview(
                noteAndFileMapper.selectNoteAndExtraFile(note_and_extra_file.getId()).getOverview());
        noteAndFileMapper.insert(note_and_extra_file);
    }

    @Override
    public void delete(String id) {
        QueryWrapper<Note_and_extra_file> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("id",id);
        noteAndFileMapper.delete(queryWrapper);
    }

    @Override
    public void update(Note_and_extra_file note_and_extra_file) {
        noteAndFileMapper.updateById(note_and_extra_file);
    }

    @Override
    public Note_and_extra_file select(String id) {
        QueryWrapper<Note_and_extra_file> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("id",id);
        return noteAndFileMapper.selectOne(queryWrapper);
    }

    @Override
    public List<Note_and_extra_file> selectMyNotes(String userId) {
        return noteAndFileMapper.getMyNotes(userId);
    }
}
