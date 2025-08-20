import React, { useState, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// SearchForm component để hiển thị giao diện tra cứu
const SearchForm = () => {
    // State để lưu trữ dữ liệu người dùng nhập vào
    const [msv, setMsv] = useState('');
    const [hoTen, setHoTen] = useState('');

    // State để quản lý kết quả tra cứu và thông báo
    const [ketQua, setKetQua] = useState(null);
    const [danhSachKetQua, setDanhSachKetQua] = useState([]);
    
    // State để quản lý trạng thái tải
    const [loading, setLoading] = useState(false);

    // Lấy hàm executeRecaptcha từ hook
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Xử lý sự kiện khi người dùng nhấn nút tra cứu
    const handleTraCuu = async (e) => {
        e.preventDefault();
        setLoading(true);
        setKetQua(null);
        setDanhSachKetQua([]);

        // Kiểm tra nếu recaptcha chưa được tải
        if (!executeRecaptcha) {
            console.log("Recaptcha has not been loaded!");
            return;
        }

        // Kiểm tra nếu cả hai trường đều trống
        if (!msv.trim() && !hoTen.trim()) {
            setKetQua({ status: 'warning', message: 'Vui lòng nhập Mã số sinh viên hoặc Họ tên để tra cứu.' });
            setLoading(false);
            return;
        }

        try {
            // Lấy token reCAPTCHA
            const token = await executeRecaptcha('search');

            // Gửi dữ liệu và token reCAPTCHA đến API backend
            const response = await fetch('https://betracuu-production.up.railway.app/api/tra-cuu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ msv, hoTen, recaptchaToken: token }),
            });

            const data = await response.json();

            // Cập nhật trạng thái dựa trên phản hồi từ backend
            if (data.status === 'success') {
                const firstResult = data.danhSachSinhVien[0];
                const hasNote = firstResult && firstResult.ghiChu && firstResult.ghiChu.includes('Sai mã SV');

                if (hasNote) {
                    setKetQua({ status: 'denied', message: 'Không nhận được vé, vì sai mã sinh viên' });
                    setDanhSachKetQua(data.danhSachSinhVien); // Vẫn hiển thị thông tin
                } else {
                    setKetQua({ status: 'success', message: data.message });
                    setDanhSachKetQua(data.danhSachSinhVien);
                }
            } else {
                // Các lỗi khác, hiển thị thông báo lỗi chung
                setKetQua({ status: 'error', message: data.message });
                setDanhSachKetQua([]);
            }

        } catch (error) {
            setKetQua({ status: 'error', message: 'Có lỗi xảy ra, vui lòng thử lại.' });
            console.error('Error:', error);
        } finally {
            setLoading(false);
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
                <h3 style={{color: "gray", fontSize: "12px", fontWeight: "500"}}>Tra cứu theo "MSV", "Họ và tên" hoặc cả hai</h3>
                <div className="input-group">
                    <label htmlFor="msv">Mã số sinh viên</label>
                    <input
                        type="text"
                        id="msv"
                        placeholder="Nhập Mã số sinh viên (MSV)"
                        value={msv}
                        onChange={(e) => setMsv(e.target.value)}
                        disabled={loading}
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
                        disabled={loading}
                        className="form-input"
                    />
                </div>
                
                <button type="submit" disabled={loading} className="search-button">
                    {loading ? (
                        <div className="loading-content">
                            <div className="loading-spinner"></div>
                            <span>Đang tra cứu...</span>
                        </div>
                    ) : (
                        'Tra cứu'
                    )}
                </button>
            </form>
            
            {ketQua && (
                <div className="results-container">
                    <div className={`result ${ketQua.status}`}>
                        <div className="result-header">
                            <div className={`status-indicator ${ketQua.status}`}></div>
                            <p className="result-message">{ketQua.message}</p>
                        </div>
                        
                        {/* Hiển thị danh sách kết quả nếu có */}
                        {danhSachKetQua.length > 0 && (
                            <div className="ticket-list">
                                {danhSachKetQua.map((sinhVien, index) => (
                                    <div key={index} className="ticket-info">
                                        <h4>Thông tin vé:</h4>
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <span className="info-label">Họ và tên:</span>
                                                <span className="info-value">{sinhVien.hoTen}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">MSV:</span>
                                                <span className="info-value">{sinhVien.msv}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Lớp:</span>
                                                <span className="info-value">{sinhVien.lopDB}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Đi ca:</span>
                                                <span className="info-value">{sinhVien.diCa}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchForm;
