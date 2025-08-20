import React, { useState } from 'react';
import { danhSachSinhVien } from '../data';

const SearchForm = () => {
  const [msv, setMsv] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [ketQua, setKetQua] = useState(null);
  const [sinhVienTimThay, setSinhVienTimThay] = useState(null);

  const handleTraCuu = (e) => {
    e.preventDefault();

    const cleanedMsv = msv.trim().toUpperCase();
    const cleanedHoTen = hoTen.trim().toLowerCase();
    
    setKetQua(null);
    setSinhVienTimThay(null);

    if (!cleanedMsv || !cleanedHoTen) {
      setKetQua({
        trangThai: 'warning',
        thongDiep: 'Vui lòng nhập đầy đủ Mã số sinh viên và Họ tên.'
      });
      return;
    }

    const foundByHoTen = danhSachSinhVien.find(
      (sinhVien) => 
        sinhVien.hoTen.trim().toLowerCase() === cleanedHoTen
    );

    if (foundByHoTen) {
      if (foundByHoTen.msv.trim().toUpperCase() !== cleanedMsv || foundByHoTen.ghiChu.includes('Sai mã SV')) {
        setKetQua({
          trangThai: 'error',
          thongDiep: `Bạn không được nhận vé vì điền sai mã sinh viên. Mã bạn điền trong đơn là ${foundByHoTen.msv}.`
        });
        setSinhVienTimThay(null);
      } else {
        setKetQua({
          trangThai: 'success',
          thongDiep: 'Chúc mừng, bạn có trong danh sách vé!'
        });
        setSinhVienTimThay(foundByHoTen);
      }
    } else {
      setKetQua({
        trangThai: 'error',
        thongDiep: 'Xin lỗi, thông tin không có trong danh sách.'
      });
      setSinhVienTimThay(null);
    }
  };

  return (
    <div className="search-container">
      <div className="header-section">
        <h1 className="main-title">Học viện Công nghệ Bưu chính Viễn thông</h1>
        <h2 className="sub-title">Đoàn Thanh niên Học viện</h2>
        <div className="divider"></div>
        <h3 className="form-title">Tra Cứu Thông Tin Đăng Ký Vé Xem Phim "Mưa Đỏ"</h3>
      </div>
      
      <form onSubmit={handleTraCuu} className="search-form">
        <div className="input-group">
          <label htmlFor="msv">Mã số sinh viên</label>
          <input
            type="text"
            id="msv"
            placeholder="Nhập Mã số sinh viên (MSV)"
            value={msv}
            onChange={(e) => setMsv(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="hoTen">Họ và tên</label>
          <input
            type="text"
            id="hoTen"
            placeholder="Nhập Họ và tên"
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            className="form-input"
          />
        </div>
        
        <button type="submit" className="search-button">
          Tra cứu
        </button>
      </form>
      
      {ketQua && (
        <div className={`result ${ketQua.trangThai}`}>
          <p className="result-message">{ketQua.thongDiep}</p>
          {sinhVienTimThay && (
            <div className="ticket-info">
              <h4>Thông tin vé:</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Họ và tên:</span>
                  <span className="info-value">{sinhVienTimThay.hoTen}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lớp:</span>
                  <span className="info-value">{sinhVienTimThay.lopDB}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Đi ca:</span>
                  <span className="info-value">{sinhVienTimThay.diCa}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchForm;