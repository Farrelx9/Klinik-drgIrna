// Socket Debug Utility
export const socketDebug = {
  // Test socket connection
  testConnection: (socket) => {
    if (!socket) {
      console.error("Socket tidak tersedia");
      return false;
    }

    console.log("Socket ID:", socket.id);
    console.log("Socket Connected:", socket.connected);
    console.log("Socket Transport:", socket.io.engine.transport.name);

    return socket.connected;
  },

  // Test emit events
  testEmit: (socket, event, data) => {
    if (!socket || !socket.connected) {
      console.error("Socket tidak terhubung");
      return false;
    }

    console.log(`Emitting ${event}:`, data);
    socket.emit(event, data);
    return true;
  },

  // Test listen events
  testListen: (socket, event, callback) => {
    if (!socket) {
      console.error("Socket tidak tersedia");
      return false;
    }

    console.log(`Listening to ${event}`);
    socket.on(event, (data) => {
      console.log(`Received ${event}:`, data);
      if (callback) callback(data);
    });
    return true;
  },

  // Monitor all events
  monitorAll: (socket) => {
    if (!socket) {
      console.error("Socket tidak tersedia");
      return;
    }

    const originalEmit = socket.emit;
    const originalOn = socket.on;

    // Monitor emit
    socket.emit = function (event, ...args) {
      console.log(`🔵 EMIT: ${event}`, args);
      return originalEmit.apply(this, [event, ...args]);
    };

    // Monitor listen
    socket.on = function (event, callback) {
      console.log(`🔴 LISTEN: ${event}`);
      return originalOn.call(this, event, (...args) => {
        console.log(`🟢 RECEIVED: ${event}`, args);
        callback(...args);
      });
    };
  },

  // Get socket status
  getStatus: (socket) => {
    if (!socket) {
      return {
        connected: false,
        id: null,
        transport: null,
        error: "Socket tidak tersedia",
      };
    }

    return {
      connected: socket.connected,
      id: socket.id,
      transport: socket.io?.engine?.transport?.name || "unknown",
      rooms: socket.rooms || [],
    };
  },
};

// Debug commands untuk browser console
export const debugCommands = {
  // Test patient socket
  testPatientSocket: () => {
    const socket = window.patientSocket;
    if (!socket) {
      console.error("Patient socket tidak ditemukan");
      return;
    }

    console.log("=== Patient Socket Debug ===");
    console.log("Status:", socketDebug.getStatus(socket));

    // Test events
    socketDebug.testListen(socket, "new-message", (data) => {
      console.log("✅ Patient received new message:", data);
    });

    socketDebug.testListen(socket, "unread-count-update", (data) => {
      console.log("✅ Patient received unread count update:", data);
    });
  },

  // Test admin socket
  testAdminSocket: () => {
    const socket = window.adminSocket;
    if (!socket) {
      console.error("Admin socket tidak ditemukan");
      return;
    }

    console.log("=== Admin Socket Debug ===");
    console.log("Status:", socketDebug.getStatus(socket));

    // Test events
    socketDebug.testListen(socket, "new-patient-message", (data) => {
      console.log("✅ Admin received new patient message:", data);
    });

    socketDebug.testListen(socket, "chat-updated-admin", (data) => {
      console.log("✅ Admin received chat update:", data);
    });
  },

  // Simulate events (untuk testing)
  simulatePatientMessage: (chatId = "test_chat_123") => {
    const socket = window.patientSocket;
    if (!socket) {
      console.error("Patient socket tidak ditemukan");
      return;
    }

    socketDebug.testEmit(socket, "new-message", {
      chatId: chatId,
      message: "Test pesan dari dokter",
      sender: "dokter",
    });
  },

  simulateAdminMessage: (chatId = "test_chat_123") => {
    const socket = window.adminSocket;
    if (!socket) {
      console.error("Admin socket tidak ditemukan");
      return;
    }

    socketDebug.testEmit(socket, "new-patient-message", {
      chatId: chatId,
      message: "Test pesan dari pasien",
      sender: "pasien",
    });
  },
};

// Expose debug commands to window for console access
if (typeof window !== "undefined") {
  window.socketDebug = socketDebug;
  window.debugCommands = debugCommands;
}
