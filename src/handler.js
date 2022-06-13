/* eslint-disable no-undef */
const { nanoid } = require('nanoid');
const notes = require('./notes');
/* eslint-disable no-unused-vars */
// handler untuk menangani request dari route (membuat catatatn)
const addNoteHandler = (request, h) => {
// mendapatkan body request menggunakan payload
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };
  notes.push(newNote);
  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// handler untuk menampilkan semua catatan
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// handler untuk menampilkan catatan yang di klik (spesifik dengan ID)
const getNoteByIdHandler = (request, h) => {
  // Pertama, kita dapatkan dulu nilai id dari request.params.
  const { id } = request.params;
  // dapatkan objek note dengan id tersebut dari objek array notes.
  // Manfaatkan method array filter() untuk mendapatkan objeknya.
  const note = notes.filter((n) => n.id === id)[0];

  // pastikan dulu objek note tidak bernilai undefined.
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  // Bila undefined, kembalikan dengan respons gagal.
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler untuk edit catatan yang di klik (spesifik dengan ID)
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  // index akan bernilai array index dari objek catatan yang dicari.
  // Namun, bila tidak ditemukan, index akan bernilai -1.
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// handler untuk menghapus catatan yang di klik (spesifik dengan ID)
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
