import React, { useState, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const SearchForm = () => {
    const [msv, setMsv] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [ketQua, setKetQua] = useState(null);
    const [sinhVienTimThay, setSinhVienTimThay] = useState(null);
    const [loading, setLoading] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleTraCuu = async (e) => {
        e.preventDefault();
        setLoading(true);
        setKetQua(null);
        setSinhVienTimThay(null);

        if (!executeRecaptcha) {
            console.log("Recaptcha has not been loaded!");
            return;
        }

        if (!msv.trim() || !hoTen.trim()) {
            setKetQua({ trangThai: 'warning', thongDiep: 'Vui lòng nhập đầy đủ Mã số sinh viên và Họ tên.' });
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

            if (data.status === 'success') {
                setKetQua({ trangThai: 'success', thongDiep: data.message });
                setSinhVienTimThay(data.sinhVien);
            } else {
                setKetQua({ trangThai: 'error', thongDiep: data.message });
                setSinhVienTimThay(null);
            }

        } catch (error) {
            setKetQua({ trangThai: 'error', thongDiep: 'Có lỗi xảy ra, vui lòng thử lại.' });
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
                <div className={`result ${ketQua.trangThai}`}>
                    <div className="result-header">
                        <div className={`status-indicator ${ketQua.trangThai}`}></div>
                        <p className="result-message">{ketQua.thongDiep}</p>
                    </div>
                    
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