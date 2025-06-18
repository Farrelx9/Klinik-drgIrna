# Socket Events Documentation

## Frontend Socket Events

### Patient Side (Konsultasi.jsx)

#### Events yang didengarkan (Listen):

1. **`new-message`** - Ketika ada pesan baru dari dokter

   ```javascript
   socket.on("new-message", (data) => {
     // data: { chatId, message, sender }
   });
   ```

2. **`unread-message-notification`** - Notifikasi pesan belum dibaca

   ```javascript
   socket.on("unread-message-notification", (data) => {
     // data: { chatId, message }
   });
   ```

3. **`unread-count-update`** - Update jumlah pesan belum dibaca

   ```javascript
   socket.on("unread-count-update", (data) => {
     // data: { chatId, unreadCount }
   });
   ```

4. **`chat-updated`** - Update chat real-time
   ```javascript
   socket.on("chat-updated", (data) => {
     // data: { chatId }
   });
   ```

#### Events yang dikirim (Emit):

1. **`join-notifications`** - Bergabung ke room notifikasi

   ```javascript
   socket.emit("join-notifications", id_user);
   ```

2. **`join-chat-room`** - Bergabung ke room chat

   ```javascript
   socket.emit("join-chat-room", id_user);
   ```

3. **`leave-notifications`** - Keluar dari room notifikasi

   ```javascript
   socket.emit("leave-notifications", id_user);
   ```

4. **`leave-chat-room`** - Keluar dari room chat
   ```javascript
   socket.emit("leave-chat-room", id_user);
   ```

### Admin Side (Chat-Tab.jsx)

#### Events yang didengarkan (Listen):

1. **`new-patient-message`** - Ketika ada pesan baru dari pasien

   ```javascript
   socket.on("new-patient-message", (data) => {
     // data: { chatId, message, sender }
   });
   ```

2. **`chat-updated-admin`** - Update chat untuk admin
   ```javascript
   socket.on("chat-updated-admin", (data) => {
     // data: { chatId }
   });
   ```

#### Events yang dikirim (Emit):

1. **`join-admin-notifications`** - Bergabung ke room notifikasi admin

   ```javascript
   socket.emit("join-admin-notifications", id_user);
   ```

2. **`join-admin-chat-room`** - Bergabung ke room chat admin

   ```javascript
   socket.emit("join-admin-chat-room", id_user);
   ```

3. **`leave-admin-notifications`** - Keluar dari room notifikasi admin

   ```javascript
   socket.emit("leave-admin-notifications", id_user);
   ```

4. **`leave-admin-chat-room`** - Keluar dari room chat admin
   ```javascript
   socket.emit("leave-admin-chat-room", id_user);
   ```

## Backend Implementation Required

### Ketika Pasien Mengirim Pesan:

```javascript
// Di endpoint POST /konsultasi/chat/kirim (pengirim: "pasien")
io.to(`admin-${chat.id_dokter}`).emit("new-patient-message", {
  chatId: chat.id_chat,
  message: pesan.isi,
  sender: "pasien",
});

io.to(`patient-${chat.id_pasien}`).emit("unread-count-update", {
  chatId: chat.id_chat,
  unreadCount: unreadCount,
});
```

### Ketika Dokter Mengirim Pesan:

```javascript
// Di endpoint POST /konsultasi/chat/kirim (pengirim: "dokter")
io.to(`patient-${chat.id_pasien}`).emit("new-message", {
  chatId: chat.id_chat,
  message: pesan.isi,
  sender: "dokter",
});

io.to(`admin-${chat.id_dokter}`).emit("unread-count-update", {
  chatId: chat.id_chat,
  unreadCount: unreadCount,
});
```

### Socket Room Management:

```javascript
// Join rooms
socket.on("join-notifications", (userId) => {
  socket.join(`notifications-${userId}`);
});

socket.on("join-chat-room", (userId) => {
  socket.join(`patient-${userId}`);
});

socket.on("join-admin-notifications", (userId) => {
  socket.join(`admin-notifications-${userId}`);
});

socket.on("join-admin-chat-room", (userId) => {
  socket.join(`admin-${userId}`);
});

// Leave rooms
socket.on("leave-notifications", (userId) => {
  socket.leave(`notifications-${userId}`);
});

socket.on("leave-chat-room", (userId) => {
  socket.leave(`patient-${userId}`);
});

socket.on("leave-admin-notifications", (userId) => {
  socket.leave(`admin-notifications-${userId}`);
});

socket.on("leave-admin-chat-room", (userId) => {
  socket.leave(`admin-${userId}`);
});
```

## Testing Socket Events

### Test dari Browser Console:

```javascript
// Test untuk patient
socket.emit("join-chat-room", "patient_user_id");
socket.on("new-message", (data) => console.log("New message:", data));

// Test untuk admin
socket.emit("join-admin-chat-room", "admin_user_id");
socket.on("new-patient-message", (data) =>
  console.log("New patient message:", data)
);
```

### Test dari Backend:

```javascript
// Simulasi pesan dari dokter ke pasien
io.to(`patient-${patientId}`).emit("new-message", {
  chatId: "chat_123",
  message: "Test pesan dari dokter",
  sender: "dokter",
});

// Simulasi pesan dari pasien ke dokter
io.to(`admin-${doctorId}`).emit("new-patient-message", {
  chatId: "chat_123",
  message: "Test pesan dari pasien",
  sender: "pasien",
});
```
