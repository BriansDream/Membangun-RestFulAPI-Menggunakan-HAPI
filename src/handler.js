const { nanoid } = require('nanoid');
const notes = require('./notes');
const addNoteHandler = (request,h) => {
    // Property request.payload untuk mendapatkan body request
    const { title, tags, body } = request.payload;

    // Package Nano id
    // Digunakan untuk menghasilkan nilai String id agar unik
    // parameter number pada method nanoid merupakan ukuran stringnya
    const id = nanoid(16);



    // Kasusnya menambah catatan baru, maka nilai kedua property ini sama
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Memasukkan nilai - nilai tersebut ke dalam array notes menggunakan method push
    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
      };
      notes.push(newNote);


    // Method filter untuk menentukan apakah newNote sudah masuk kedalam array notes (Berdasarkan ID Catatan)
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

//   Gunakan isSucces untuk menentukan respons yang diberikan server,
// Jika isSuccess bernilai true, maka beri respons berhasil, jika false maka beri respons gagal.
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



const getAllNotesHandler = () => ({
    status: 'success',
    data: {
      notes,
    },
  });

  const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
 
    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
          status: 'success',
          data: {
            note,
          },
        };
      }
      const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      });
      response.code(404);
      return response;
};



const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();



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
module.exports = { addNoteHandler,getAllNotesHandler,getNoteByIdHandler,editNoteByIdHandler,deleteNoteByIdHandler };