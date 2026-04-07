exports.getStaff = async (req, res) => {
  try {
    const staffs = [
      {
        "Mã số nhân viên": "NV-001",
        "Tên nhân viên": "Nguyễn Văn An",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Văn phòng",
        "Trợ cấp": 150000.0,
      },
      {
        "Mã số nhân viên": "KT-002",
        "Tên nhân viên": "Trần Thị Bình",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Kế toán",
        "Hệ số lương": 2.5,
      },
      {
        "Mã số nhân viên": "NV-003",
        "Tên nhân viên": "Lê Văn Cường",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Văn phòng",
        "Trợ cấp": 200000.0,
      },
      {
        "Mã số nhân viên": "KT-004",
        "Tên nhân viên": "Phạm Minh Đức",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Kế toán",
        "Hệ số lương": 3.0,
      },
      {
        "Mã số nhân viên": "NV-005",
        "Tên nhân viên": "Hoàng Thị Hoa",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Văn phòng",
        "Trợ cấp": 100000.0,
      },
      {
        "Mã số nhân viên": "KT-006",
        "Tên nhân viên": "Vũ Hoàng Long",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Kế toán",
        "Hệ số lương": 2.2,
      },
      {
        "Mã số nhân viên": "NV-007",
        "Tên nhân viên": "Đặng Văn Nam",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Văn phòng",
        "Trợ cấp": 300000.0,
      },
      {
        "Mã số nhân viên": "KT-008",
        "Tên nhân viên": "Bùi Thị Ngọc",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Kế toán",
        "Hệ số lương": 2.8,
      },
      {
        "Mã số nhân viên": "NV-009",
        "Tên nhân viên": "Ngô Văn Phúc",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Văn phòng",
        "Trợ cấp": 180000.0,
      },
      {
        "Mã số nhân viên": "KT-010",
        "Tên nhân viên": "Lý Minh Quang",
        "Lương cơ bản": 500000.0,
        "Loại nhân viên": "Kế toán",
        "Hệ số lương": 3.5,
      },
    ];
    return res.status(200).json({ nhanvien: staffs });
  } catch (error) {}
};
