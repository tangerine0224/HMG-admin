// FIX: Correctly import React hooks and remove invalid 'aistudio' import.
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- HELPERS ---
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        // FIX: Add Intl.DateTimeFormatOptions type to the options object to fix type error.
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        return new Intl.DateTimeFormat('vi-VN', options).format(date);
    } catch (error) {
        return dateString;
    }
};

const formatPrice = (price: number | string) => {
    if (typeof price !== 'number') return price;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};


// --- MOCK DATA ---
const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', phone: '0901234567', role: 'Quản trị' },
    { id: 2, name: 'Trần Thị B', email: 'thib@example.com', phone: '0912345678', role: 'Đại lý' },
    { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', phone: '0923456789', role: 'Môi giới' },
    { id: 4, name: 'Công ty BĐS ABC', email: 'abc@agency.com', phone: '0987654321', role: 'Đại lý' },
];

const mockProjects = [
    { id: 1, name: 'Vinhomes Grand Park', investor: 'Vingroup', location: 'Quận 9, TP. HCM', coordinates: '10.8411, 106.8099', description: 'Đại đô thị thông minh', landArea: 2710000, buildArea: 542000, email: 'info@vinhomes.vn', facebook: 'fb.com/vinhomes', tiktok: 'tiktok.com/@vinhomes', status: 'Đang mở bán', visible: true, createdAt: '2023-01-10T09:00:00Z' },
    { id: 2, name: 'The Origami', investor: 'Vingroup', location: 'Quận 9, TP. HCM', coordinates: '10.8411, 106.8099', description: 'Phân khu phong cách Nhật Bản', landArea: 260000, buildArea: 52000, email: 'info@origami.vn', facebook: '', tiktok: '', status: 'Đã bán hết', visible: true, createdAt: '2023-05-15T14:30:00Z' },
    { id: 3, name: 'Masteri Centre Point', investor: 'Masterise Homes', location: 'Quận 9, TP. HCM', coordinates: '10.8411, 106.8099', description: 'Khu căn hộ cao cấp', landArea: 70000, buildArea: 14000, email: 'info@masterise.vn', facebook: 'fb.com/masterise', tiktok: '', status: 'Sắp mở bán', visible: false, createdAt: '2024-02-20T11:00:00Z' },
];

const mockSubdivisions = [
    // Subdivisions (Phân khu)
    { id: 1, category: 'subdivision', projectId: 1, name: 'The Rainbow', code: 'RB', type: 'Phân khu Căn hộ', status: 'Đang mở bán', createdAt: '2023-01-15T10:00:00Z', visible: true },
    { id: 2, category: 'subdivision', projectId: 1, name: 'The Origami', code: 'OG', type: 'Phân khu Căn hộ', status: 'Đang mở bán', createdAt: '2023-05-20T14:30:00Z', visible: true },
    { id: 3, category: 'subdivision', projectId: 1, name: 'The Manhattan', code: 'MH', type: 'Phân khu Biệt thự', status: 'Đã bán hết', createdAt: '2022-11-10T09:00:00Z', visible: false },

    // Blocks (Khối BĐS)
    { id: 4, category: 'block', projectId: 1, parentSubdivisionId: 1, name: 'Tòa S1.01', code: 'S101', type: 'Chung cư', status: 'Đang mở bán', unitCount: 250, createdAt: '2024-02-01T11:00:00Z', visible: true },
    { id: 5, category: 'block', projectId: 1, parentSubdivisionId: 2, name: 'Tòa S2.02', code: 'S202', type: 'Chung cư', status: 'Đang mở bán', unitCount: 300, createdAt: '2024-06-15T16:45:00Z', visible: true },
    { id: 6, category: 'block', projectId: 1, parentSubdivisionId: 3, name: 'Khu Liền kề A - Phố Đông', code: 'LK-A', type: 'Liền kề', status: 'Đã bán hết', unitCount: 50, createdAt: '2023-09-15T16:45:00Z', visible: false },
    { id: 7, category: 'block', projectId: 2, name: 'Central Park 1', code: 'CP1', type: 'Shophouse', status: 'Sắp mở bán', unitCount: 40, createdAt: '2024-08-01T10:00:00Z', visible: true }, // No parent subdivision
];

const mockUnitTypes = [
    { id: 1, name: 'Căn 2PN-A (59m2) - View hồ', type: 'Căn hộ', area: 59, bedrooms: 2, bathrooms: 2, createdAt: '2023-08-01T10:00:00Z' },
    { id: 2, name: 'Shophouse khối đế S1.01', type: 'Shophouse', area: 120, bedrooms: 0, bathrooms: 1, createdAt: '2023-08-05T11:30:00Z' },
    { id: 3, name: 'Biệt thự song lập Garden View', type: 'Biệt thự', area: 250, bedrooms: 4, bathrooms: 5, createdAt: '2023-09-10T14:00:00Z' },
    { id: 4, name: 'Căn Studio (35m2)', type: 'Căn hộ', area: 35, bedrooms: 1, bathrooms: 1, createdAt: '2023-10-15T09:00:00Z' },
    { id: 5, name: 'Nhà phố thương mại 5x20m', type: 'Nhà phố', area: 100, bedrooms: 3, bathrooms: 3, createdAt: '2024-01-20T16:45:00Z' },
    { id: 6, name: 'Căn 3PN (98m2) - Căn góc', type: 'Căn hộ', area: 98, bedrooms: 3, bathrooms: 2, createdAt: '2024-03-22T12:00:00Z' },
];

const mockProjectAgencies = [
    { projectId: 1, agencyId: 2 },
    { projectId: 1, agencyId: 4 },
];

const mockRetailProperties = [
    { id: 1, code: 'VGP-S101-0101', title: 'Căn hộ 2PN view công viên', name: 'S1.01-0101', status: 'Đang mở bán', type: 'Căn hộ', projectId: 1, subdivisionId: 1, blockId: 4, price: 2800000000, visible: true, createdAt: '2024-07-01T10:00:00Z' },
    { id: 2, code: 'VGP-S101-0102', title: 'Căn hộ studio', name: 'S1.01-0102', status: 'Đang mở bán', type: 'Căn hộ', projectId: 1, subdivisionId: 1, blockId: 4, price: 1500000000, visible: true, createdAt: '2024-07-01T10:00:00Z' },
    { id: 3, code: 'VGP-MH-LK-A-05', title: 'Biệt thự song lập The Manhattan', name: 'LK-A-05', status: 'Đã bán hết', type: 'Biệt thự', projectId: 1, subdivisionId: 3, blockId: 6, price: 25000000000, visible: false, createdAt: '2023-11-20T10:00:00Z' },
    { id: 4, code: 'MCP-CP1-SH01', title: 'Shophouse mặt tiền đường lớn', name: 'CP1-SH01', status: 'Sắp mở bán', type: 'Shophouse', projectId: 2, subdivisionId: null, blockId: 7, price: 12000000000, visible: true, createdAt: '2024-08-10T10:00:00Z' },
    { id: 5, code: 'RE-TD-01', title: 'Biệt thự Thảo Điền view sông', name: 'Villa Thảo Điền', status: 'Đang mở bán', type: 'Biệt thự', projectId: null, subdivisionId: null, blockId: null, price: 150000000000, visible: true, createdAt: '2024-05-15T10:00:00Z' },
    { id: 6, code: 'RE-Q1-NP', title: 'Nhà phố trung tâm Quận 1', name: 'Nhà phố Nguyễn Huệ', status: 'Đã bán hết', type: 'Nhà phố', projectId: null, subdivisionId: null, blockId: null, price: 50000000000, visible: true, createdAt: '2024-01-10T10:00:00Z' },
];

const mockNotifications = [
    { id: 1, title: 'Chào mừng bạn đến với nền tảng mới!', type: 'Thông báo', audience: 'Tất cả người dùng', status: 'Đã gửi', createdAt: '2024-08-01T10:00:00Z' },
    { id: 2, title: 'Banner quảng cáo dự án Vinhomes Grand Park', type: 'Banner', audience: 'Người dùng mới', status: 'Đã gửi', createdAt: '2024-07-30T15:00:00Z' },
    { id: 3, title: 'Sự kiện mở bán The Origami sắp diễn ra', type: 'Thông báo', audience: 'Khách hàng quan tâm', status: 'Nháp', createdAt: '2024-08-05T11:30:00Z' },
];


const mockTransactions = [
    { id: 'TXN001', unitCode: 'S1.01-0502', projectName: 'Vinhomes Grand Park', customerName: 'Trần Thị B', amount: '50,000,000 VND', date: '2024-07-20', status: 'Thành công' },
    { id: 'TXN002', unitCode: 'SHOP-A5', projectName: 'Vinhomes Grand Park', customerName: 'Nguyễn Văn A', amount: '200,000,000 VND', date: '2024-07-19', status: 'Thành công' },
    { id: 'TXN003', unitCode: 'S2.05-1005', projectName: 'The Origami', customerName: 'Lê Văn C', amount: '100,000,000 VND', date: '2024-07-18', status: 'Đang xử lý' },
];

const mockLivestreams = [
    { id: 1, title: 'Mở bán dự án The 9 Stellars', startTime: '2024-08-15T19:00:00Z', youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', relatedProducts: [5] },
    { id: 2, title: 'Giới thiệu dự án Masteri', startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), youtubeLink: 'https://youtu.be/dQw4w9WgXcQ', relatedProducts: [] },
    { id: 3, title: 'Hỏi đáp cùng chuyên gia (Đã diễn ra)', startTime: '2024-07-25T14:00:00Z', youtubeLink: 'https://youtube.com/live/someid', relatedProducts: [1, 2, 3] },
    { id: 4, title: 'Sự kiện đang diễn ra', startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), youtubeLink: 'https://youtube.com/live/someid', relatedProducts: [4] },
];

const mockConversations = [
    { id: 1, customerName: 'Phạm Nhật Vượng', lastMessage: 'Tôi muốn mua 10 căn hộ.', timestamp: '10:45 AM', avatar: 'PV' },
    { id: 2, customerName: 'Đặng Lê Nguyên Vũ', lastMessage: 'Dự án này có gần quán cafe không?', timestamp: 'Hôm qua', avatar: 'DV' },
    { id: 3, customerName: 'Trần Đình Long', lastMessage: 'Gửi cho tôi bảng giá thép...', timestamp: '2 ngày trước', avatar: 'TL' },
];

const mockMessages = {
    1: [
        { id: 1, sender: 'customer', text: 'Chào bạn, tôi quan tâm đến dự án Vinhomes Grand Park.' },
        { id: 2, sender: 'admin', text: 'Chào anh, dự án đó đang rất hot. Anh cần thêm thông tin gì ạ?' },
        { id: 3, sender: 'customer', text: 'Tôi muốn mua 10 căn hộ.' },
    ],
    2: [
        { id: 1, sender: 'customer', text: 'Dự án này có gần quán cafe không?' },
    ],
    3: [
         { id: 1, sender: 'customer', text: 'Gửi cho tôi bảng giá thép...' },
    ]
};

const STATUS_OPTIONS = ["Đang mở bán", "Sắp mở bán", "Đã bán hết"];

// --- ICONS ---
const Icon = ({ path, size = 22, style = {} }: {path: React.ReactNode, size?: number, style?: React.CSSProperties}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, ...style }}
    >
        {path}
    </svg>
);

const DashboardIcon = () => <Icon path={<><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></>} />;
const UsersIcon = () => <Icon path={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></>} />;
const ProductsIcon = () => <Icon path={<><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></>} />;
const TransactionIcon = () => <Icon path={<><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></>} />;
const LivestreamIcon = () => <Icon path={<><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></>} />;
const InboxIcon = () => <Icon path={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></>} />;
const NotificationIcon = () => <Icon path={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></>} />;
const ChevronLeftIcon = () => <Icon path={<polyline points="15 18 9 12 15 6"></polyline>} />;
const ChevronRightIcon = () => <Icon path={<polyline points="9 18 15 12 9 6"></polyline>} />;
const TrashIcon = () => <Icon path={<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>} size={18} />;
const EditIcon = () => <Icon path={<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>} size={18} />;
const XIcon = ({ size = 20 }) => <Icon path={<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>} size={size} />;
const DownloadIcon = () => <Icon path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></>} size={18} />;


// --- STYLES ---
// FIX: Add type annotation to fix multiple CSS property type errors throughout the file.
const styles: { [key: string]: React.CSSProperties } = {
    appContainer: {
        display: 'flex',
        width: '100%',
        height: '100vh',
    },
    sidebar: {
        width: '240px',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease-in-out, padding 0.2s ease-in-out',
        flexShrink: 0,
    },
    navItem: {
        padding: '12px 15px',
        marginBottom: '8px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    subNavItem: {
        padding: '10px 15px 10px 50px', // Indent sub-items to align with text
        marginBottom: '4px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 400,
        fontSize: '14px',
    },
    mainContent: {
        flex: 1,
        padding: '30px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        fontSize: '28px',
        fontWeight: 600,
        marginBottom: '20px',
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
    },
    cardTitle: {
        fontSize: '16px',
        color: 'var(--text-secondary)',
        marginBottom: '10px',
    },
    cardValue: {
        fontSize: '32px',
        fontWeight: 700,
    },
    tableContainer: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        padding: '15px',
        textAlign: 'left',
        borderBottom: '2px solid var(--border-color)',
        backgroundColor: '#f8f9fa',
        fontWeight: 600,
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        borderBottom: '1px solid var(--border-color)',
    },
    button: {
        backgroundColor: 'var(--button-bg)',
        color: 'var(--button-text)',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'background-color 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
    },
    actionButton: {
        backgroundColor: 'transparent',
        border: '1px solid var(--border-color)',
        color: 'var(--text-color)',
        padding: '5px 10px',
        marginRight: '5px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
    },
    liveBadge: {
        backgroundColor: 'var(--live-color)',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 700,
        display: 'inline-block',
        marginLeft: '10px'
    },
    // Inbox styles
    inboxContainer: {
        display: 'flex',
        flex: 1,
        height: 'calc(100% - 70px)', // Adjust based on header height
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
        overflow: 'hidden',
    },
    conversationList: {
        width: '300px',
        borderRight: '1px solid var(--border-color)',
        overflowY: 'auto',
    },
    conversationItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        cursor: 'pointer',
        borderBottom: '1px solid var(--border-color)',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e9ecef',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '10px',
    },
    conversationDetails: {
        flex: 1,
        overflow: 'hidden',
    },
    customerName: {
        fontWeight: 600,
        margin: 0,
    },
    lastMessage: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: '4px 0 0',
    },
    chatWindow: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    chatHeader: {
        padding: '15px 20px',
        borderBottom: '1px solid var(--border-color)',
        fontWeight: 600,
    },
    messageList: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    messageBubble: {
        padding: '10px 15px',
        borderRadius: '18px',
        maxWidth: '70%',
        wordBreak: 'break-word',
    },
    adminMessage: {
        backgroundColor: 'var(--button-bg)',
        color: 'var(--button-text)',
        alignSelf: 'flex-end',
        borderBottomRightRadius: '4px',
    },
    customerMessage: {
        backgroundColor: '#f1f3f5',
        color: 'var(--text-color)',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: '4px',
    },
    messageInputContainer: {
        display: 'flex',
        padding: '15px',
        borderTop: '1px solid var(--border-color)',
        gap: '10px',
    },
    messageInput: {
        flex: 1,
        padding: '10px 15px',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: 'var(--text-color)',
    },
    sendButton: {
        backgroundColor: 'var(--button-bg)',
        color: 'var(--button-text)',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 500,
    },
    sidebarToggle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '15px',
        marginTop: 'auto',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        borderTop: '1px solid var(--border-color)',
    },
    // Modal Styles
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
    },
    modalHeader: {
        fontSize: '20px',
        fontWeight: 600,
        marginBottom: '20px',
    },
    modalCloseButton: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
    },
    formGroup: {
        marginBottom: '15px',
    },
    formLabel: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 500,
    },
    formInput: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: 'var(--text-color)',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    formPageContainer: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
        maxWidth: '900px',
        margin: '0 auto',
    },
    formFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '25px',
        gap: '10px',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '20px',
    },
    // Bulk action styles
    bulkActionToolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '10px 15px',
        backgroundColor: 'var(--active-item-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    bulkActionSelect: {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        backgroundColor: '#ffffff',
        color: 'var(--text-color)',
    },
    formSection: {
        marginBottom: '30px',
    },
    formSectionHeader: {
        fontSize: '18px',
        fontWeight: 600,
        paddingBottom: '10px',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '20px',
    },
    richTextContainer: {
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        overflow: 'hidden',
    },
    richTextToolbar: {
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid var(--border-color)',
        fontSize: '12px',
        color: 'var(--text-secondary)'
    },
    richTextEditor: {
        width: '100%',
        padding: '10px',
        border: 'none',
        height: '150px',
        resize: 'vertical',
        fontSize: '14px',
        backgroundColor: '#ffffff',
        color: 'var(--text-color)',
    },
    // Toggle Switch Styles
    toggleSwitch: {
        position: 'relative',
        display: 'inline-block',
        width: '44px',
        height: '24px',
        cursor: 'pointer',
    },
    toggleSwitchSlider: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ccc',
        transition: '.4s',
        borderRadius: '24px',
    },
    toggleSwitchKnob: {
        position: 'absolute',
        height: '16px',
        width: '16px',
        left: '4px',
        bottom: '4px',
        backgroundColor: 'white',
        transition: '.4s',
        borderRadius: '50%',
    },
     // Tab Styles
    tabContainer: {
        display: 'flex',
        borderBottom: '2px solid var(--border-color)',
        marginBottom: '20px',
    },
    tabButton: {
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '16px',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        borderBottom: '2px solid transparent',
        marginBottom: '-2px',
    },
    activeTabButton: {
        color: 'var(--text-color)',
        borderBottom: '2px solid var(--button-bg)',
    },
    tabContent: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: 'var(--card-shadow)',
    }
};

// --- COMPONENTS ---

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => {
    return (
        <div style={styles.toggleSwitch} onClick={onChange}>
            <div style={{...styles.toggleSwitchSlider, backgroundColor: checked ? 'var(--button-bg)' : '#ccc'}}></div>
            <div style={{...styles.toggleSwitchKnob, transform: checked ? 'translateX(20px)' : 'translateX(0)'}}></div>
        </div>
    );
};

const Sidebar = ({ activeView, setView, isCollapsed, setCollapsed }: { activeView: string, setView: (view: string) => void, isCollapsed: boolean, setCollapsed: (isCollapsed: boolean) => void }) => {
    const handleNavClick = (view: string) => {
        setView(view);
    };

    const handleProductsMenuClick = () => {
        if (isCollapsed) {
            setCollapsed(false);
        }
    };

    const navItems = [
        { id: 'dashboard', label: 'Tổng quan', icon: <DashboardIcon /> },
        { id: 'users', label: 'Quản lý người dùng', icon: <UsersIcon /> },
        {
            id: 'products', label: 'Sản phẩm', icon: <ProductsIcon />, subItems: [
                { id: 'products.projects', label: 'Dự án' },
                { id: 'products.subdivisions', label: 'Phân khu' },
                { id: 'products.buildings', label: 'Khối BĐS' },
                { id: 'products.unittypes', label: 'Mẫu nhà' },
                { id: 'products.properties', label: 'Bất động sản' },
            ]
        },
        { id: 'transactions', label: 'Giao dịch', icon: <TransactionIcon /> },
        { id: 'livestream', label: 'Livestream', icon: <LivestreamIcon /> },
        { id: 'inbox', label: 'Inbox', icon: <InboxIcon /> },
        { id: 'notifications', label: 'Thông báo', icon: <NotificationIcon /> },
    ];

    const sidebarStyle: React.CSSProperties = {
        ...styles.sidebar,
        width: isCollapsed ? '88px' : '240px',
        padding: isCollapsed ? '20px 0' : '20px',
    };
    
    const navItemStyle = (isCollapsed: boolean): React.CSSProperties => ({
        ...styles.navItem,
        justifyContent: isCollapsed ? 'center' : 'flex-start',
    });
    
    const sidebarToggleStyle: React.CSSProperties = {
        ...styles.sidebarToggle,
        margin: isCollapsed ? 'auto 0 -20px 0' : 'auto -20px -20px -20px',
    };


    return (
        <div style={sidebarStyle}>
            <nav style={{ flex: 1, overflow: 'hidden' }}>
                {navItems.map(item => (
                    <div key={item.id}>
                        <div
                            style={{
                                ...navItemStyle(isCollapsed),
                                backgroundColor: activeView === item.id || (item.id === 'products' && activeView.startsWith('products.')) ? 'var(--active-item-bg)' : 'transparent',
                                fontWeight: activeView === item.id || (item.id === 'products' && activeView.startsWith('products.')) ? 600 : 500,
                                cursor: (item.id === 'products' && !isCollapsed) ? 'default' : 'pointer',
                            }}
                            onClick={() => item.subItems ? handleProductsMenuClick() : handleNavClick(item.id)}
                            role="button"
                            aria-current={activeView === item.id}
                            title={isCollapsed ? item.label : ''}
                        >
                            {item.icon}
                            {!isCollapsed && <span>{item.label}</span>}
                        </div>
                        {!isCollapsed && item.subItems && (
                            <div>
                                {item.subItems.map(subItem => (
                                    <div
                                        key={subItem.id}
                                        style={{
                                            ...styles.subNavItem,
                                            backgroundColor: activeView === subItem.id ? 'var(--active-item-bg)' : 'transparent',
                                            fontWeight: activeView === subItem.id ? 600 : 400,
                                        }}
                                        onClick={() => handleNavClick(subItem.id)}
                                        role="button"
                                    >
                                        {subItem.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
            <div style={sidebarToggleStyle} onClick={() => setCollapsed(!isCollapsed)}>
                {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </div>
        </div>
    );
};

const DashboardView = () => (
    <div>
        <h2 style={styles.header}>Tổng quan</h2>
        <div style={styles.cardGrid}>
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Người dùng</h3>
                <p style={styles.cardValue}>{mockUsers.length}</p>
            </div>
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Sản phẩm</h3>
                <p style={styles.cardValue}>{mockProjects.length + mockRetailProperties.length}</p>
            </div>
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Giao dịch thành công</h3>
                <p style={styles.cardValue}>{mockTransactions.filter(t => t.status === 'Thành công').length}</p>
            </div>
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Tin nhắn chưa đọc</h3>
                <p style={styles.cardValue}>1</p>
            </div>
        </div>
    </div>
);

const AddUserModal = ({ isOpen, onClose, onAddUser }: { isOpen: boolean, onClose: () => void, onAddUser: (user: any) => void }) => {
    // FIX: Replace `aistudio.useState` with `useState`.
    const [name, setName] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [email, setEmail] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [phone, setPhone] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [role, setRole] = useState('Môi giới');

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Basic validation
        if (!name || !email || !phone) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        onAddUser({ name, email, phone, role });
        // Reset form and close
        setName('');
        setEmail('');
        setPhone('');
        setRole('Môi giới');
        onClose();
    };

    return (
        <div style={styles.modalBackdrop} onClick={onClose}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h3 style={styles.modalHeader}>Thêm người dùng mới</h3>
                <button style={styles.modalCloseButton} onClick={onClose}><XIcon /></button>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="name">Tên</label>
                    <input type="text" id="name" style={styles.formInput} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="email">Email</label>
                    <input type="email" id="email" style={styles.formInput} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="phone">Số điện thoại</label>
                    <input type="tel" id="phone" style={styles.formInput} value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel} htmlFor="role">Vai trò</label>
                    <select id="role" style={styles.formInput} value={role} onChange={e => setRole(e.target.value)}>
                        <option value="Quản trị">Quản trị</option>
                        <option value="Đại lý">Đại lý</option>
                        <option value="Môi giới">Môi giới</option>
                    </select>
                </div>
                <div style={styles.formFooter}>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={onClose}>Hủy</button>
                    <button style={styles.button} onClick={handleSubmit}>Tạo người dùng</button>
                </div>
            </div>
        </div>
    );
};


const UserManagementView = () => {
    // FIX: Replace `aistudio.useState` with `useState`.
    const [users, setUsers] = useState(mockUsers);
    // FIX: Replace `aistudio.useState` with `useState`.
    // FIX: Explicitly type the Set to number to resolve type inference issue.
    const [selectedUserIds, setSelectedUserIds] = useState(new Set<number>());
    // FIX: Replace `aistudio.useState` with `useState`.
    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [bulkActionRole, setBulkActionRole] = useState('Môi giới');

    const handleSelectUser = (userId: number) => {
        setSelectedUserIds(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(userId)) {
                newSelection.delete(userId);
            } else {
                newSelection.add(userId);
            }
            return newSelection;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedUserIds(new Set(users.map(u => u.id)));
        } else {
            setSelectedUserIds(new Set());
        }
    };
    
    const handleAddUser = (newUser: any) => {
        setUsers(prevUsers => [{ ...newUser, id: Date.now() }, ...prevUsers]);
    };

    const handleBulkDelete = () => {
        setUsers(prev => prev.filter(user => !selectedUserIds.has(user.id)));
        setSelectedUserIds(new Set());
    };
    
    const handleBulkRoleChange = () => {
        setUsers(prev => prev.map(user => 
            selectedUserIds.has(user.id) ? { ...user, role: bulkActionRole } : user
        ));
        setSelectedUserIds(new Set());
    };

    const isAllSelected = selectedUserIds.size > 0 && selectedUserIds.size === users.length;

    return (
        <div>
            <AddUserModal 
                isOpen={isAddUserModalOpen} 
                onClose={() => setAddUserModalOpen(false)} 
                onAddUser={handleAddUser}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>Quản lý người dùng</h2>
                <button style={styles.button} onClick={() => setAddUserModalOpen(true)}>Thêm người dùng</button>
            </div>
            
            {selectedUserIds.size > 0 && (
                <div style={styles.bulkActionToolbar}>
                    <span style={{ fontWeight: 600 }}>{selectedUserIds.size} đã chọn</span>
                    <button style={styles.actionButton} onClick={handleBulkDelete}><TrashIcon/> Xóa</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                       <select 
                         style={styles.bulkActionSelect} 
                         value={bulkActionRole}
                         onChange={e => setBulkActionRole(e.target.value)}
                       >
                            <option value="Quản trị">Quản trị</option>
                            <option value="Đại lý">Đại lý</option>
                            <option value="Môi giới">Môi giới</option>
                        </select>
                        <button style={styles.button} onClick={handleBulkRoleChange}>Thay đổi vai trò</button>
                    </div>
                </div>
            )}

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '50px' }}>
                                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                            </th>
                            <th style={styles.th}>Tên</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Số điện thoại</th>
                            <th style={styles.th}>Vai trò</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{backgroundColor: selectedUserIds.has(user.id) ? 'var(--active-item-bg)' : 'transparent'}}>
                                <td style={styles.td}>
                                    <input type="checkbox" checked={selectedUserIds.has(user.id)} onChange={() => handleSelectUser(user.id)} />
                                </td>
                                <td style={styles.td}>{user.name}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>{user.phone}</td>
                                <td style={styles.td}>{user.role}</td>
                                <td style={styles.td}>
                                    <button style={styles.actionButton}>Sửa</button>
                                    <button style={styles.actionButton} onClick={() => {
                                        setUsers(prev => prev.filter(u => u.id !== user.id));
                                    }}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AddProjectView = ({ onAddProject, setView }: { onAddProject: (project: any) => void, setView: (view: string) => void }) => {
    // FIX: Replace `aistudio.useState` with `useState`.
    const [name, setName] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [investor, setInvestor] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [managementUnit, setManagementUnit] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [address, setAddress] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [coordinates, setCoordinates] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [description, setDescription] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [landArea, setLandArea] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [buildArea, setBuildArea] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [email, setEmail] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [phone, setPhone] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [facebook, setFacebook] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [tiktok, setTiktok] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [thumbnail, setThumbnail] = useState(null);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [gallery, setGallery] = useState(null);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [infoPdf, setInfoPdf] = useState(null);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [masterPlan, setMasterPlan] = useState(null);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [status, setStatus] = useState(STATUS_OPTIONS[0]);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [isVisible, setIsVisible] = useState(true);

    // FIX: Replace `aistudio.useState` with `useState`.
    const [startMonth, setStartMonth] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [startYear, setStartYear] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [handoverMonth, setHandoverMonth] = useState('');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [handoverYear, setHandoverYear] = useState('');

    const handleSubmit = () => {
        if (!name || !investor || !address) {
            alert('Vui lòng điền các trường bắt buộc: Tên dự án, Chủ đầu tư, Địa chỉ.');
            return;
        }
        onAddProject({
            name,
            investor,
            managementUnit,
            location: address,
            coordinates,
            description,
            landArea,
            buildArea,
            email,
            phone,
            facebook,
            tiktok,
            status,
            visible: isVisible,
        });
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i).reverse();
    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>Tạo dự án mới</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 500 }}>Hiển thị</span>
                        <ToggleSwitch checked={isVisible} onChange={() => setIsVisible(!isVisible)} />
                    </div>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={() => setView('products.projects')}>Hủy</button>
                    <button style={styles.button} onClick={handleSubmit}>Lưu thay đổi</button>
                </div>
            </div>

             <div style={styles.formPageContainer}>
                {/* Section 1: Basic Info */}
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>Thông tin cơ bản</h3>
                    <div style={{...styles.formGroup, marginBottom: '15px'}}>
                        <label style={styles.formLabel}>Tên dự án</label>
                        <input type="text" style={styles.formInput} value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div style={{...styles.formGrid, marginBottom: '15px'}}>
                        <div style={{...styles.formGroup, marginBottom: 0}}>
                            <label style={styles.formLabel}>Chủ đầu tư</label>
                            <input type="text" style={styles.formInput} value={investor} onChange={e => setInvestor(e.target.value)} />
                        </div>
                        <div style={{...styles.formGroup, marginBottom: 0}}>
                            <label style={styles.formLabel}>Đơn vị quản lý vận hành</label>
                            <input type="text" style={styles.formInput} value={managementUnit} onChange={e => setManagementUnit(e.target.value)} />
                        </div>
                    </div>
                     <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Ảnh đại diện</label>
                        <input type="file" style={styles.formInput} accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThumbnail(e.target.files ? e.target.files[0] : null)} />
                    </div>
                </div>

                {/* Section: Location Info */}
                 <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>Thông tin vị trí</h3>
                     <div style={{...styles.formGroup, marginBottom: '15px'}}>
                        <label style={styles.formLabel}>Địa chỉ dự án</label>
                        <input type="text" style={styles.formInput} value={address} onChange={e => setAddress(e.target.value)} />
                    </div>
                    <div style={{...styles.formGrid, gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '15px' }}>
                        <div style={{...styles.formGroup, marginBottom: 0}}>
                             <label style={styles.formLabel}>Tỉnh/Thành phố</label>
                             <select style={styles.formInput}><option>-- Chọn Tỉnh/Thành phố --</option><option>TP. Hồ Chí Minh</option><option>Hà Nội</option></select>
                        </div>
                        <div style={{...styles.formGroup, marginBottom: 0}}>
                             <label style={styles.formLabel}>Quận/Huyện</label>
                             <select style={styles.formInput}><option>-- Chọn Quận/Huyện --</option><option>Quận 9</option><option>Quận 2</option></select>
                        </div>
                         <div style={{...styles.formGroup, marginBottom: 0}}>
                             <label style={styles.formLabel}>Phường/Xã</label>
                             <select style={styles.formInput}><option>-- Chọn Phường/Xã --</option><option>Phường Long Thạnh Mỹ</option></select>
                        </div>
                    </div>
                    <div style={{...styles.formGroup, marginBottom: 0}}>
                        <label style={styles.formLabel}>Tọa độ</label>
                        <input type="text" style={styles.formInput} value={coordinates} onChange={e => setCoordinates(e.target.value)} placeholder="e.g., 10.7769, 106.7009"/>
                    </div>
                </div>

                {/* Section 2: Description */}
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>Mô tả</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Mô tả chi tiết</label>
                         <div style={styles.richTextContainer}>
                            <div style={styles.richTextToolbar}>Bold, Italic, Underline... (Rich text support)</div>
                            <textarea style={styles.richTextEditor} value={description} onChange={e => setDescription(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Tổng diện tích đất (m²)</label>
                            <input type="number" style={styles.formInput} value={landArea} onChange={e => setLandArea(e.target.value)} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Tổng diện tích xây dựng (m²)</label>
                            <input type="number" style={styles.formInput} value={buildArea} onChange={e => setBuildArea(e.target.value)} />
                        </div>
                    </div>
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Thời gian khởi công</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                               <select style={styles.formInput} value={startMonth} onChange={e => setStartMonth(e.target.value)}>
                                    <option value="">Tháng</option>
                                    {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select style={styles.formInput} value={startYear} onChange={e => setStartYear(e.target.value)}>
                                    <option value="">Năm</option>
                                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Thời gian bàn giao</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <select style={styles.formInput} value={handoverMonth} onChange={e => setHandoverMonth(e.target.value)}>
                                     <option value="">Tháng</option>
                                    {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select style={styles.formInput} value={handoverYear} onChange={e => setHandoverYear(e.target.value)}>
                                     <option value="">Năm</option>
                                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Trạng thái dự án</label>
                        <select style={styles.formInput} value={status} onChange={e => setStatus(e.target.value)}>
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>File thông tin đính kèm (pdf)</label>
                        <input type="file" style={styles.formInput} accept=".pdf" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInfoPdf(e.target.files ? e.target.files[0] : null)} />
                    </div>
                </div>

                {/* Section 3: Images */}
                <div style={styles.formSection}>
                     <h3 style={styles.formSectionHeader}>Hình ảnh</h3>
                     <div style={{...styles.formGroup, marginBottom: '15px'}}>
                        <label style={styles.formLabel}>Mặt bằng tổng thể dự án</label>
                        <input type="file" style={styles.formInput} accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMasterPlan(e.target.files ? e.target.files[0] : null)} />
                     </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Thư viện hình ảnh</label>
                        <input type="file" multiple style={styles.formInput} accept="image/*" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGallery(e.target.files)} />
                    </div>
                </div>
                
                {/* Section 4: Contact */}
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>Liên hệ</h3>
                    <div style={styles.formGrid}>
                         <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Email dự án</label>
                            <input type="email" style={styles.formInput} value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Số điện thoại dự án</label>
                            <input type="tel" style={styles.formInput} value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                    </div>
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Facebook</label>
                            <input type="text" style={styles.formInput} value={facebook} onChange={e => setFacebook(e.target.value)} />
                        </div>
                        <div style={styles.formGroup}>
                           <label style={styles.formLabel}>Tiktok</label>
                           <input type="text" style={styles.formInput} value={tiktok} onChange={e => setTiktok(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectManagementView = ({
    projects,
    setView,
    onToggleVisibility,
    onEditProject,
    onDeleteProject,
    onBulkDelete,
    onBulkToggleVisibility,
}: {
    projects: any[];
    setView: (view: string, state?: any) => void;
    onToggleVisibility: (id: number) => void;
    onEditProject: (project: any) => void;
    onDeleteProject: (project: any) => void;
    onBulkDelete: (ids: Set<number>) => void;
    onBulkToggleVisibility: (ids: Set<number>, visibility: boolean) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set<number>());

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'all' || p.status === statusFilter;
            return nameMatch && statusMatch;
        });
    }, [projects, searchTerm, statusFilter]);

    const handleSelectRow = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredProjects.map(p => p.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleBulkDeleteClick = () => {
        onBulkDelete(selectedIds);
        setSelectedIds(new Set());
    };
    
    const handleBulkVisibilityClick = (visibility: boolean) => {
        onBulkToggleVisibility(selectedIds, visibility);
        setSelectedIds(new Set());
    };

    const isAllSelected = selectedIds.size > 0 && selectedIds.size === filteredProjects.length;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{...styles.header, marginBottom: 0}}>Quản lý Dự án</h2>
                <div>
                     <button 
                        style={{...styles.actionButton, padding: '10px 15px', marginRight: '10px'}} 
                        onClick={() => alert('Chức năng import sẽ được bổ sung sau.')}>
                            <DownloadIcon/> Import (CSV)
                     </button>
                     <button style={styles.button} onClick={() => setView('products.projects.add')}>Tạo dự án mới</button>
                </div>
            </div>

            <div style={{...styles.tableContainer, padding: '15px', marginBottom: '20px', backgroundColor: '#f8f9fa', border: '1px solid var(--border-color)', boxShadow: 'none'}}>
                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên dự án..." 
                        style={styles.formInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                     <select style={styles.formInput} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">Tất cả trạng thái</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {selectedIds.size > 0 && (
                <div style={styles.bulkActionToolbar}>
                    <span style={{ fontWeight: 600 }}>{selectedIds.size} đã chọn</span>
                    <button style={styles.actionButton} onClick={handleBulkDeleteClick}><TrashIcon/> Xóa</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                       <span style={{fontWeight: 500}}>Cài đặt hiển thị:</span>
                       <button style={{...styles.actionButton, padding: '8px 12px'}} onClick={() => handleBulkVisibilityClick(true)}>Hiện</button>
                       <button style={{...styles.actionButton, padding: '8px 12px'}} onClick={() => handleBulkVisibilityClick(false)}>Ẩn</button>
                    </div>
                </div>
            )}
            
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '50px' }}>
                                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                            </th>
                            <th style={styles.th}>Tên dự án</th>
                            <th style={styles.th}>Trạng thái giao dịch</th>
                            <th style={styles.th}>Ngày tạo</th>
                            <th style={styles.th}>Hiển thị</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map(project => (
                            <tr key={project.id} style={{backgroundColor: selectedIds.has(project.id) ? 'var(--active-item-bg)' : 'transparent'}}>
                                <td style={styles.td}>
                                    <input type="checkbox" checked={selectedIds.has(project.id)} onChange={() => handleSelectRow(project.id)} />
                                </td>
                                <td style={{...styles.td, cursor: 'pointer', fontWeight: 500}} onClick={() => onEditProject(project)}>{project.name}</td>
                                <td style={styles.td}>{project.status}</td>
                                <td style={styles.td}>{formatDate(project.createdAt).split(',')[1]}</td>
                                <td style={styles.td}>
                                    <ToggleSwitch 
                                        checked={project.visible} 
                                        onChange={() => onToggleVisibility(project.id)} 
                                    />
                                </td>
                                <td style={styles.td}>
                                    <button style={styles.actionButton} onClick={() => onEditProject(project)}>Sửa</button>
                                    <button style={styles.actionButton} onClick={() => onDeleteProject(project)}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- PROJECT DETAIL VIEW AND TABS ---

const OverviewTab = ({ project }: { project: any }) => {
    // In a real app, you would manage state for each field to make them editable.
    // For this example, we'll just display the data in form inputs.
    return (
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
            {/* Section 1: Basic Info */}
            <div style={styles.formSection}>
                <h3 style={styles.formSectionHeader}>Thông tin cơ bản</h3>
                <div style={{...styles.formGroup, marginBottom: '15px'}}>
                    <label style={styles.formLabel}>Tên dự án</label>
                    <input type="text" style={styles.formInput} defaultValue={project.name} />
                </div>
                <div style={{...styles.formGrid, marginBottom: '15px'}}>
                    <div style={{...styles.formGroup, marginBottom: 0}}>
                        <label style={styles.formLabel}>Chủ đầu tư</label>
                        <input type="text" style={styles.formInput} defaultValue={project.investor} />
                    </div>
                    <div style={{...styles.formGroup, marginBottom: 0}}>
                        <label style={styles.formLabel}>Đơn vị quản lý vận hành</label>
                        <input type="text" style={styles.formInput} defaultValue={project.managementUnit} />
                    </div>
                </div>
                <div style={styles.formGrid}>
                    <div style={{...styles.formGroup, marginBottom: 0}}>
                        <label style={styles.formLabel}>Địa chỉ dự án</label>
                        <input type="text" style={styles.formInput} defaultValue={project.location} />
                    </div>
                    <div style={{...styles.formGroup, marginBottom: 0}}>
                        <label style={styles.formLabel}>Tọa độ</label>
                        <input type="text" style={styles.formInput} defaultValue={project.coordinates}/>
                    </div>
                </div>
            </div>

            {/* Section 2: Description */}
            <div style={styles.formSection}>
                <h3 style={styles.formSectionHeader}>Mô tả</h3>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Mô tả chi tiết</label>
                     <div style={styles.richTextContainer}>
                        <div style={styles.richTextToolbar}>Bold, Italic, Underline... (Rich text support)</div>
                        <textarea style={styles.richTextEditor} defaultValue={project.description}></textarea>
                    </div>
                </div>
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Tổng diện tích đất (m²)</label>
                        <input type="number" style={styles.formInput} defaultValue={project.landArea} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Tổng diện tích xây dựng (m²)</label>
                        <input type="number" style={styles.formInput} defaultValue={project.buildArea} />
                    </div>
                </div>
                 <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Trạng thái dự án</label>
                    <select style={styles.formInput} defaultValue={project.status}>
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>File thông tin đính kèm (pdf)</label>
                    <input type="file" style={styles.formInput} accept=".pdf" />
                </div>
            </div>

            {/* Section 3: Images */}
            <div style={styles.formSection}>
                 <h3 style={styles.formSectionHeader}>Hình ảnh</h3>
                 <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Mặt bằng tổng thể dự án</label>
                    <input type="file" style={styles.formInput} accept="image/*" />
                 </div>
                 <div style={styles.formGrid}>
                     <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Ảnh đại diện</label>
                        <input type="file" style={styles.formInput} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Thư viện hình ảnh</label>
                        <input type="file" multiple style={styles.formInput} />
                    </div>
                </div>
            </div>
            
            {/* Section 4: Contact */}
            <div style={styles.formSection}>
                <h3 style={styles.formSectionHeader}>Liên hệ</h3>
                <div style={styles.formGrid}>
                     <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Email dự án</label>
                        <input type="email" style={styles.formInput} defaultValue={project.email} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Số điện thoại dự án</label>
                        <input type="tel" style={styles.formInput} defaultValue={project.phone} />
                    </div>
                </div>
                 <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Facebook</label>
                        <input type="text" style={styles.formInput} defaultValue={project.facebook} />
                    </div>
                    <div style={styles.formGroup}>
                       <label style={styles.formLabel}>Tiktok</label>
                       <input type="text" style={styles.formInput} defaultValue={project.tiktok} />
                    </div>
                </div>
            </div>

             <div style={styles.formFooter}>
                <button style={styles.button}>Lưu thay đổi</button>
            </div>
        </div>
    );
};

// FIX: Add a props interface with optional properties to fix missing props errors.
interface TabularDataManagementProps {
    title: string;
    columns: { key: string; label: string; render?: (row: any) => React.ReactNode }[];
    data: any[];
    description?: string;
    onAdd?: () => void;
    onEdit?: (row: any) => void;
    onImport?: () => void;
    onDelete?: (row: any) => void;
    onBulkDelete?: () => void;
    selectedIds?: Set<any>;
    onSelectRow?: (id: any) => void;
    onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isAllSelected?: boolean;
    renderActions?: (row: any) => React.ReactNode;
    renderToolbar?: () => React.ReactNode;
}

const TabularDataManagement = ({
    title,
    columns,
    data,
    onAdd,
    onEdit,
    onImport,
    onDelete,
    onBulkDelete,
    selectedIds,
    onSelectRow,
    onSelectAll,
    isAllSelected,
    description,
    renderActions,
    renderToolbar,
}: TabularDataManagementProps) => {
    const hasSelection = selectedIds && selectedIds.size > 0;
    const hasActions = onEdit || onDelete || renderActions;

    return (
        <div>
            {title && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    {hasSelection ? (
                        <div style={{...styles.bulkActionToolbar, width: '100%', justifyContent: 'flex-start', margin: 0}}>
                             <span style={{ fontWeight: 600 }}>{selectedIds.size} đã chọn</span>
                             {onBulkDelete && <button style={styles.actionButton} onClick={onBulkDelete}><TrashIcon/> Xóa</button>}
                        </div>
                    ) : (
                        <>
                            <div>
                                 <h3 style={{ margin: 0, fontSize: '20px' }}>{title}</h3>
                                 {description && <p style={{margin: '5px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)'}}>{description}</p>}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {renderToolbar ? renderToolbar() : (
                                    <>
                                    {onImport && <button style={{...styles.actionButton, padding: '10px 15px'}} onClick={onImport}><DownloadIcon/> Tải lên (CSV)</button>}
                                    {onAdd && <button style={styles.button} onClick={onAdd}>Thêm mới</button>}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            {onSelectRow && (
                                <th style={{...styles.th, width: '50px' }}>
                                    <input type="checkbox" checked={!!isAllSelected} onChange={onSelectAll} />
                                </th>
                            )}
                            {columns.map(col => <th key={col.key} style={styles.th}>{col.label}</th>)}
                            {hasActions && <th style={styles.th}>Hành động</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <tr key={row.id} style={{backgroundColor: hasSelection && selectedIds.has(row.id) ? 'var(--active-item-bg)' : 'transparent'}}>
                                {onSelectRow && (
                                    <td style={styles.td}>
                                        <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => onSelectRow(row.id)} />
                                    </td>
                                )}
                                {columns.map(col => (
                                    <td key={`${row.id}-${col.key}`} style={styles.td}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                                {hasActions && (
                                    <td style={styles.td}>
                                        {renderActions ? renderActions(row) : (
                                            <>
                                                {onEdit && <button style={styles.actionButton} onClick={() => onEdit(row)}>Sửa</button>}
                                                {onDelete && <button style={styles.actionButton} onClick={() => onDelete(row)}>Xoá</button>}
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const LinkedSubdivisionsTab = ({ project }: { project: any }) => {
    const data = mockSubdivisions.filter(s => s.projectId === project.id);

    const columns = [
        { key: 'name', label: 'Tên Phân khu / Khối BĐS' },
        { key: 'code', label: 'Mã' },
        { key: 'type', label: 'Loại hình' },
        { key: 'status', label: 'Trạng thái' },
    ];

    return (
        <TabularDataManagement
            title="Danh sách Phân khu & Khối BĐS liên kết"
            description="Các phân khu và khối BĐS thuộc dự án này. Quản lý tại các mục tương ứng trong 'Sản phẩm'."
            columns={columns}
            data={data}
        />
    );
};


const AgenciesTab = ({ project }: { project: any }) => {
    // FIX: Replace `aistudio.useState` with `useState`.
    // FIX: Explicitly type useState to Set<number> to resolve type inference issue.
    const [selectedIds, setSelectedIds] = useState(new Set<number>());
    
    // FIX: Replace `aistudio.useMemo` with `useMemo`.
    const agenciesForProject = useMemo(() => {
        const agencyIds = new Set(mockProjectAgencies.filter(pa => pa.projectId === project.id).map(pa => pa.agencyId));
        return mockUsers.filter(user => agencyIds.has(user.id));
    }, [project.id]);

    const data = agenciesForProject;
    const isAllSelected = selectedIds.size > 0 && selectedIds.size === data.length;

     const handleSelectRow = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(data.map(d => d.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleBulkDelete = () => {
        alert(`Removing ${selectedIds.size} agencies`);
        setSelectedIds(new Set());
    };
    
    const agencyColumns = [
        { key: 'name', label: 'Tên đại lý' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Số điện thoại' },
    ];
    
    return (
        <TabularDataManagement
            title="Quản lý Đại lý phân phối"
            description="Thêm hoặc xóa các đại lý được phép phân phối sản phẩm của dự án."
            columns={agencyColumns}
            data={data}
            onAdd={() => alert('Add Agency')}
            onDelete={(row) => alert(`Remove agency ${row.name}`)}
            selectedIds={selectedIds}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            onBulkDelete={handleBulkDelete}
            isAllSelected={isAllSelected}
        />
    );
};

const ProjectDetailView = ({ project, setView }: { project: any, setView: (view: string) => void }) => {
    // FIX: Replace `aistudio.useState` with `useState`.
    const [activeTab, setActiveTab] = useState('overview');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [isVisible, setIsVisible] = useState(project.visible);
    
    const tabs = [
        { id: 'overview', label: 'Tổng quan' },
        { id: 'linkedSubdivisions', label: 'Phân khu / Khối BĐS' },
        { id: 'agencies', label: 'Đại lý' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab project={project} />;
            case 'linkedSubdivisions': return <LinkedSubdivisionsTab project={project} />;
            case 'agencies': return <AgenciesTab project={project} />;
            default: return null;
        }
    };
    
    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setView('products.projects')} style={{...styles.actionButton, border: 'none', padding: '5px 0', marginBottom: '10px'}}>
                    &larr; Quay lại danh sách dự án
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ ...styles.header, marginBottom: 0 }}>{project.name}</h2>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 500 }}>Hiển thị</span>
                        <ToggleSwitch checked={isVisible} onChange={() => setIsVisible(!isVisible)} />
                    </div>
                </div>
            </div>
            
             <div style={styles.tabContainer}>
                {tabs.map(tab => (
                    <button 
                        key={tab.id} 
                        style={{...styles.tabButton, ...(activeTab === tab.id ? styles.activeTabButton : {})}}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>{renderTabContent()}</div>
        </div>
    );
};


const AddEditSubdivisionBlockView = ({
    mode, // 'add' or 'edit'
    item, // The item to edit, null if adding
    onSave,
    onCancel,
    category, // 'subdivision' or 'block'
    projects = [],
    subdivisions = [],
}: {
    mode: 'add' | 'edit';
    item: any | null;
    onSave: (data: any) => void;
    onCancel: () => void;
    category: 'subdivision' | 'block';
    projects?: any[];
    subdivisions?: any[];
}) => {

    const [formData, setFormData] = useState(item || {
        projectId: '',
        name: '',
        code: '',
        type: category === 'block' ? 'Chung cư' : 'Phân khu Căn hộ',
        status: 'Sắp mở bán',
        parentSubdivisionId: '',
        // Block specific
        floorsAbove: '',
        floorsBelow: '',
        apartmentFloors: '',
        unitCount: '',
        elevatorCount: '',
        landArea: '',
        constructionArea: '',
        greeneryArea: '',
        frontageWidth: '',
        buildingFloors: '',
        firstFloorCeilingHeight: '',
        walkwayDesign: '',
        // Generic
        description: '',
        handoverDate: '',
        category: category,
    });
    
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (category === 'subdivision' && !formData.projectId) {
             alert('Vui lòng chọn một Dự án.');
             return;
        }
        if (!formData.name || !formData.type) {
            alert('Vui lòng nhập Tên và chọn Loại hình.');
            return;
        }
        onSave(formData);
    };
    
    const SUBDIVISION_TYPES = ["Phân khu Biệt thự", "Phân khu Nhà phố", "Phân khu Căn hộ"];
    const BUILDING_TYPES = ["Chung cư", "Shophouse", "Liền kề", "Biệt thự", "Officetel", "Condotel"];

    // Conditional rendering checks
    const propertyType = formData.type;
    const isHighRise = ['Chung cư', 'Condotel', 'Officetel'].includes(propertyType);
    const isLowRise = ['Liền kề', 'Shophouse', 'Biệt thự'].includes(propertyType);

    // Form for "Phân Khu" (Subdivision)
    const renderSubdivisionForm = () => (
        <>
            <div style={styles.formSection}>
                <h3 style={styles.formSectionHeader}>A. Thông tin liên kết (Bắt buộc)</h3>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Thuộc Dự án</label>
                    <select style={styles.formInput} value={formData.projectId} onChange={e => handleInputChange('projectId', e.target.value)}>
                        <option value="" disabled>-- Chọn dự án --</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>
            <div style={styles.formSection}>
                <h3 style={styles.formSectionHeader}>B. Thông tin cơ bản</h3>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Tên Phân khu</label>
                    <input type="text" style={styles.formInput} value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                </div>
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Mã Phân khu</label>
                        <input type="text" style={styles.formInput} value={formData.code} onChange={e => handleInputChange('code', e.target.value)} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Loại hình</label>
                        <select style={styles.formInput} value={formData.type} onChange={e => handleInputChange('type', e.target.value)}>
                            <option value="" disabled>-- Chọn loại hình --</option>
                            {SUBDIVISION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Trạng thái</label>
                    <select style={styles.formInput} value={formData.status} onChange={e => handleInputChange('status', e.target.value)}>
                        {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>
        </>
    );

    // Form for "Khối BĐS" (Property Block)
    const renderBlockForm = () => (
         <>
            {/* THÔNG TIN CƠ BẢN */}
            <div style={styles.formSection}>
                <h3 style={styles.formSectionHeader}>THÔNG TIN CƠ BẢN</h3>
                <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Tên khối</label>
                        <input type="text" style={styles.formInput} value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Thuộc phân khu</label>
                        <select style={styles.formInput} value={formData.parentSubdivisionId} onChange={e => handleInputChange('parentSubdivisionId', e.target.value)}>
                            <option value="">Không thuộc phân khu nào</option>
                             {subdivisions.map(s => <option key={s.id} value={s.id}>{s.name} ({projects.find(p => p.id === s.projectId)?.name})</option>)}
                        </select>
                    </div>
                </div>
                 <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Mã khối</label>
                        <input type="text" style={styles.formInput} value={formData.code} onChange={e => handleInputChange('code', e.target.value)} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Loại hình</label>
                        <select style={styles.formInput} value={formData.type} onChange={e => handleInputChange('type', e.target.value)}>
                             {BUILDING_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Trạng thái giao dịch</label>
                    <select style={styles.formInput} value={formData.status} onChange={e => handleInputChange('status', e.target.value)}>
                        {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                </div>
            </div>
            {/* THÔNG SỐ KỸ THUẬT */}
            <div style={styles.formSection}>
                 <h3 style={styles.formSectionHeader}>THÔNG SỐ KỸ THUẬT</h3>
                 <div style={styles.formGrid}>
                    {isHighRise && (
                        <>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng nổi</label><input type="number" style={styles.formInput} value={formData.floorsAbove} onChange={e => handleInputChange('floorsAbove', e.target.value)} /></div>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng hầm</label><input type="number" style={styles.formInput} value={formData.floorsBelow} onChange={e => handleInputChange('floorsBelow', e.target.value)} /></div>
                        </>
                    )}
                     {(propertyType === 'Chung cư' || propertyType === 'Condotel') && (
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng căn hộ</label><input type="number" style={styles.formInput} value={formData.apartmentFloors} onChange={e => handleInputChange('apartmentFloors', e.target.value)} /></div>
                    )}
                    <div style={styles.formGroup}><label style={styles.formLabel}>Số lượng căn</label><input type="number" style={styles.formInput} value={formData.unitCount} onChange={e => handleInputChange('unitCount', e.target.value)} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Số lượng thang máy</label><input type="number" style={styles.formInput} value={formData.elevatorCount} onChange={e => handleInputChange('elevatorCount', e.target.value)} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích khu đất (m²)</label><input type="number" style={styles.formInput} value={formData.landArea} onChange={e => handleInputChange('landArea', e.target.value)} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích xây dựng (m²)</label><input type="number" style={styles.formInput} value={formData.constructionArea} onChange={e => handleInputChange('constructionArea', e.target.value)} /></div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích cây xanh, mặt nước</label><input type="number" style={styles.formInput} value={formData.greeneryArea} onChange={e => handleInputChange('greeneryArea', e.target.value)} /></div>
                     {isLowRise && (
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng xây dựng (điển hình)</label><input type="number" style={styles.formInput} value={formData.buildingFloors} onChange={e => handleInputChange('buildingFloors', e.target.value)} /></div>
                    )}
                     {(propertyType === 'Liền kề' || propertyType === 'Shophouse') && (
                        <div style={styles.formGroup}><label style={styles.formLabel}>Bề rộng mặt tiền (điển hình) (m)</label><input type="number" style={styles.formInput} value={formData.frontageWidth} onChange={e => handleInputChange('frontageWidth', e.target.value)} /></div>
                    )}
                     {propertyType === 'Shophouse' && (
                        <div style={styles.formGroup}><label style={styles.formLabel}>Chiều cao trần Tầng 1</label><input type="text" style={styles.formInput} value={formData.firstFloorCeilingHeight} onChange={e => handleInputChange('firstFloorCeilingHeight', e.target.value)} /></div>
                    )}
                     {(propertyType === 'Shophouse' || propertyType === 'Officetel') && (
                         <div style={styles.formGroup}><label style={styles.formLabel}>Thiết kế Lối đi</label><input type="text" style={styles.formInput} value={formData.walkwayDesign} onChange={e => handleInputChange('walkwayDesign', e.target.value)} /></div>
                    )}
                 </div>
            </div>
        </>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>
                    {mode === 'add' ? `Tạo mới ${category === 'subdivision' ? 'Phân khu' : 'Khối BĐS'}` : `Chỉnh sửa: ${item?.name}`}
                </h2>
                <div>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={onCancel}>Hủy</button>
                    <button style={styles.button} onClick={handleSubmit}>Lưu</button>
                </div>
            </div>
            <div style={styles.formPageContainer}>
                {category === 'subdivision' ? renderSubdivisionForm() : renderBlockForm()}
            </div>
        </div>
    );
};

const SubdivisionManagementView = ({
    subdivisions,
    onAdd,
    onDelete,
    onEdit,
    onToggleVisibility,
    onBulkDelete,
    onBulkToggleVisibility,
}: {
    subdivisions: any[];
    onAdd: () => void;
    onDelete: (item: any) => void;
    onEdit: (item: any) => void;
    onToggleVisibility: (id: number) => void;
    onBulkDelete: (ids: Set<number>) => void;
    onBulkToggleVisibility: (ids: Set<number>, visibility: boolean) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [projectFilter, setProjectFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set<number>());

    const filteredSubdivisions = useMemo(() => {
        return subdivisions.filter(s => {
            const nameMatch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
            const projectMatch = projectFilter === 'all' || s.projectId === parseInt(projectFilter, 10);
            const typeMatch = typeFilter === 'all' || s.type === typeFilter;
            const statusMatch = statusFilter === 'all' || s.status === statusFilter;
            return nameMatch && projectMatch && typeMatch && statusMatch;
        });
    }, [subdivisions, searchTerm, projectFilter, typeFilter, statusFilter]);

    const handleSelectRow = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredSubdivisions.map(s => s.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleBulkDeleteClick = () => {
        onBulkDelete(selectedIds);
        setSelectedIds(new Set());
    };
    
    const handleBulkVisibilityClick = (visibility: boolean) => {
        onBulkToggleVisibility(selectedIds, visibility);
        setSelectedIds(new Set());
    };

    const isAllSelected = selectedIds.size > 0 && selectedIds.size === filteredSubdivisions.length;

    const uniqueTypes = [...new Set(mockSubdivisions.filter(s => s.category === 'subdivision').map(s => s.type))];
    
    const columns = [
        { key: 'name', label: 'Tên Phân khu', render: (row: any) => <span style={{cursor: 'pointer', fontWeight: 500}} onClick={() => onEdit(row)}>{row.name}</span> },
        { key: 'project', label: 'Thuộc Dự án', render: (row: any) => mockProjects.find(p => p.id === row.projectId)?.name || 'N/A' },
        { key: 'status', label: 'Trạng thái giao dịch' },
        { key: 'createdAt', label: 'Ngày tạo', render: (row: any) => formatDate(row.createdAt).split(',')[1] }, // Show only date part
        { key: 'visible', label: 'Hiển thị', render: (row: any) => <ToggleSwitch checked={row.visible} onChange={() => onToggleVisibility(row.id)} /> },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{...styles.header, marginBottom: 0}}>Quản lý Phân khu</h2>
                <div>
                     <button style={{...styles.actionButton, padding: '10px 15px', marginRight: '10px'}}><DownloadIcon/> Import (CSV)</button>
                     <button style={styles.button} onClick={onAdd}>Tạo phân khu mới</button>
                </div>
            </div>

            <div style={{...styles.tableContainer, padding: '15px', marginBottom: '20px', backgroundColor: '#f8f9fa', border: '1px solid var(--border-color)', boxShadow: 'none'}}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên phân khu..." 
                        style={styles.formInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                     <select style={styles.formInput} value={projectFilter} onChange={e => setProjectFilter(e.target.value)}>
                        <option value="all">Tất cả dự án</option>
                        {mockProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select style={styles.formInput} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="all">Tất cả loại hình</option>
                        {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                     <select style={styles.formInput} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">Tất cả trạng thái</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {selectedIds.size > 0 && (
                <div style={styles.bulkActionToolbar}>
                    <span style={{ fontWeight: 600 }}>{selectedIds.size} đã chọn</span>
                    <button style={styles.actionButton} onClick={handleBulkDeleteClick}><TrashIcon/> Xóa</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                       <span style={{fontWeight: 500}}>Cài đặt hiển thị:</span>
                       <button style={{...styles.actionButton, padding: '8px 12px'}} onClick={() => handleBulkVisibilityClick(true)}>Hiện</button>
                       <button style={{...styles.actionButton, padding: '8px 12px'}} onClick={() => handleBulkVisibilityClick(false)}>Ẩn</button>
                    </div>
                </div>
            )}
            
             <TabularDataManagement
                title=""
                columns={columns}
                data={filteredSubdivisions}
                onDelete={onDelete}
                onEdit={onEdit}
                selectedIds={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isAllSelected={isAllSelected}
            />
        </div>
    );
};


const SubdivisionDetailView = ({ item, setView, subdivisions, onSave, onDelete, onEdit }: { item: any, setView: (view: string, state?: any) => void, subdivisions: any[], onSave: (data: any) => void, onDelete: (item: any) => void, onEdit: (item: any) => void }) => {
    const [activeTab, setActiveTab] = useState('info');

    const tabs = [
        { id: 'info', label: 'Thông tin chung' },
        { id: 'buildings', label: 'Danh sách Khối BĐS' },
        { id: 'inventory', label: 'Quản lý giỏ hàng' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <AddEditSubdivisionBlockView
                           mode="edit"
                           item={item}
                           onSave={onSave}
                           onCancel={() => setView('products.subdivisions')}
                           category="subdivision"
                           projects={mockProjects}
                       />;
            case 'buildings':
                const buildingData = subdivisions.filter(s => s.projectId === item.projectId && s.category === 'block');
                const buildingColumns = [
                    { key: 'name', label: 'Tên Khối BĐS' },
                    { key: 'code', label: 'Mã' },
                    { key: 'status', label: 'Trạng thái' },
                    { key: 'createdAt', label: 'Ngày tạo', render: (row: any) => formatDate(row.createdAt).split(',')[1] },
                ];
                return (
                    <div style={{...styles.tabContent, padding: '0', boxShadow: 'none', backgroundColor: 'transparent' }}>
                        <TabularDataManagement
                            title="Danh sách Khối BĐS"
                            description={`Các khối BĐS thuộc dự án ${mockProjects.find(p=>p.id === item.projectId)?.name}.`}
                            columns={buildingColumns}
                            data={buildingData}
                            onAdd={() => setView('products.buildings.add', { prefill: { projectId: item.projectId } })}
                            onEdit={(building) => onEdit(building)}
                            onDelete={(building) => onDelete(building)}
                        />
                    </div>
                );
            case 'inventory':
                 return (
                    <div style={styles.tabContent}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Quản lý giỏ hàng</h3>
                        <p style={{margin: '0 0 20px 0', color: 'var(--text-secondary)'}}>Tạo và quản lý các căn hộ/sản phẩm trong phân khu này.</p>
                        <button style={styles.button} onClick={() => setView('products.subdivisions.inventory.bulk-add', { subdivision: item })}>
                            Tạo giỏ hàng hàng loạt
                        </button>
                    </div>
                 );
            default:
                return null;
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setView('products.subdivisions')} style={{...styles.actionButton, border: 'none', padding: '5px 0', marginBottom: '10px'}}>
                    &larr; Quay lại danh sách phân khu
                </button>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>Phân khu: {item.name}</h2>
            </div>
            
            <div style={styles.tabContainer}>
                {tabs.map(tab => (
                    <button 
                        key={tab.id} 
                        style={{...styles.tabButton, ...(activeTab === tab.id ? styles.activeTabButton : {})}}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div>{renderTabContent()}</div>
        </div>
    );
};

const BuildingManagementView = ({
    buildings,
    subdivisions,
    onAdd,
    onDelete,
    onEdit,
    onToggleVisibility,
    onBulkDelete,
    onBulkToggleVisibility,
}: {
    buildings: any[];
    subdivisions: any[];
    onAdd: () => void;
    onDelete: (item: any) => void;
    onEdit: (item: any) => void;
    onToggleVisibility: (id: number) => void;
    onBulkDelete: (ids: Set<number>) => void;
    onBulkToggleVisibility: (ids: Set<number>, visibility: boolean) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subdivisionFilter, setSubdivisionFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState(new Set<number>());

    const filteredBuildings = useMemo(() => {
        return buildings.filter(b => {
            const nameMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
            const subdivisionMatch = subdivisionFilter === 'all' ||
                (subdivisionFilter === 'none' && !b.parentSubdivisionId) ||
                b.parentSubdivisionId == subdivisionFilter;
            const typeMatch = typeFilter === 'all' || b.type === typeFilter;
            return nameMatch && subdivisionMatch && typeMatch;
        });
    }, [buildings, searchTerm, subdivisionFilter, typeFilter]);

    const handleSelectRow = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredBuildings.map(b => b.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleBulkDeleteClick = () => {
        onBulkDelete(selectedIds);
        setSelectedIds(new Set());
    };

    const handleBulkVisibilityClick = (visibility: boolean) => {
        onBulkToggleVisibility(selectedIds, visibility);
        setSelectedIds(new Set());
    };

    const isAllSelected = selectedIds.size > 0 && selectedIds.size === filteredBuildings.length;

    const uniqueTypes = [...new Set(buildings.map(b => b.type))];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{...styles.header, marginBottom: 0}}>Quản lý Khối BĐS</h2>
                <div>
                     <button style={{...styles.actionButton, padding: '10px 15px', marginRight: '10px'}}><DownloadIcon/> Import (CSV)</button>
                     <button style={styles.button} onClick={onAdd}>Tạo khối mới</button>
                </div>
            </div>

            <div style={{...styles.tableContainer, padding: '15px', marginBottom: '20px', backgroundColor: '#f8f9fa', border: '1px solid var(--border-color)', boxShadow: 'none'}}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên khối..." 
                        style={styles.formInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select style={styles.formInput} value={subdivisionFilter} onChange={e => setSubdivisionFilter(e.target.value)}>
                        <option value="all">Tất cả phân khu</option>
                        {subdivisions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        <option value="none">Không thuộc phân khu nào</option>
                    </select>
                    <select style={styles.formInput} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="all">Tất cả loại hình</option>
                        {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {selectedIds.size > 0 && (
                <div style={styles.bulkActionToolbar}>
                    <span style={{ fontWeight: 600 }}>{selectedIds.size} đã chọn</span>
                    <button style={styles.actionButton} onClick={handleBulkDeleteClick}><TrashIcon/> Xóa</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                       <span style={{fontWeight: 500}}>Cài đặt hiển thị:</span>
                       <button style={{...styles.actionButton, padding: '8px 12px'}} onClick={() => handleBulkVisibilityClick(true)}>Hiện</button>
                       <button style={{...styles.actionButton, padding: '8px 12px'}} onClick={() => handleBulkVisibilityClick(false)}>Ẩn</button>
                    </div>
                </div>
            )}
            
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '50px' }}><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
                            <th style={styles.th}>Tên Khối</th>
                            <th style={styles.th}>Thuộc Phân khu</th>
                            <th style={styles.th}>Loại hình</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Số lượng Units</th>
                            <th style={styles.th}>Hiển thị</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBuildings.map(block => {
                             const parentSub = subdivisions.find(s => s.id === block.parentSubdivisionId);
                             return (
                                <tr key={block.id} style={{backgroundColor: selectedIds.has(block.id) ? 'var(--active-item-bg)' : 'transparent'}}>
                                    <td style={styles.td}><input type="checkbox" checked={selectedIds.has(block.id)} onChange={() => handleSelectRow(block.id)} /></td>
                                    <td style={{...styles.td, cursor: 'pointer', fontWeight: 500}} onClick={() => onEdit(block)}>{block.name}</td>
                                    <td style={styles.td}>{parentSub ? parentSub.name : 'Không thuộc phân khu nào'}</td>
                                    <td style={styles.td}>{block.type}</td>
                                    <td style={styles.td}>{block.status}</td>
                                    <td style={styles.td}>{block.unitCount}</td>
                                    <td style={styles.td}><ToggleSwitch checked={block.visible} onChange={() => onToggleVisibility(block.id)} /></td>
                                    <td style={styles.td}>
                                        <button style={styles.actionButton} onClick={() => onEdit(block)}>Sửa</button>
                                        <button style={styles.actionButton} onClick={() => onDelete(block)}>Xoá</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const AddEditUnitTypeView = ({
    mode,
    item,
    onSave,
    onCancel,
}: { mode: 'add' | 'edit', item: any | null, onSave: (data: any) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState(item || {
        name: '',
        code: '',
        type: 'Căn hộ',
        clearanceArea: '',
        builtUpArea: '',
        bedrooms: '',
        bathrooms: '',
        doorDirection: '',
        balconyDirection: '',
        kitchenDirection: '',
        houseDirection: '',
        landArea: '',
        buildingArea: '',
        floors: '',
        frontageWidth: '',
        description: '',
        price: '',
        floorPlanImage: null,
        gallery: null,
        document: null,
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleFileChange = (field: string, files: FileList | null) => {
         handleInputChange(field, files);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.type) {
            alert('Vui lòng nhập Tên Mẫu nhà và chọn Loại hình.');
            return;
        }
        onSave(formData);
    };

    const PROPERTY_TYPES = ["Căn hộ", "Biệt thự", "Nhà phố", "Shophouse", "Officetel"];
    const DIRECTIONS = ["Đông", "Tây", "Nam", "Bắc", "Đông-Bắc", "Tây-Bắc", "Đông-Nam", "Tây-Nam"];

    const isHouseLike = ['Biệt thự', 'Nhà phố', 'Shophouse'].includes(formData.type);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>
                    {mode === 'add' ? 'Tạo mẫu nhà mới' : `Chỉnh sửa: ${item?.name}`}
                </h2>
                <div>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={onCancel}>Hủy</button>
                    <button style={styles.button} onClick={handleSubmit}>Lưu</button>
                </div>
            </div>
            <div style={styles.formPageContainer}>
                {/* THÔNG TIN CƠ BẢN */}
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>THÔNG TIN CƠ BẢN</h3>
                    <div style={styles.formGrid}>
                        <div style={{...styles.formGroup, gridColumn: 'span 2'}}>
                            <label style={styles.formLabel}>Tên mẫu nhà</label>
                            <input type="text" style={styles.formInput} value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Mã mẫu nhà</label>
                            <input type="text" style={styles.formInput} value={formData.code} onChange={e => handleInputChange('code', e.target.value)} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Loại hình</label>
                            <select style={styles.formInput} value={formData.type} onChange={e => handleInputChange('type', e.target.value)}>
                                {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* THÔNG SỐ KỸ THUẬT */}
                <div style={styles.formSection}>
                     <h3 style={styles.formSectionHeader}>THÔNG SỐ KỸ THUẬT</h3>
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích thông thủy (m²)</label><input type="number" style={styles.formInput} value={formData.clearanceArea} onChange={e => handleInputChange('clearanceArea', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích tim tường (m²)</label><input type="number" style={styles.formInput} value={formData.builtUpArea} onChange={e => handleInputChange('builtUpArea', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số phòng ngủ</label><input type="number" style={styles.formInput} value={formData.bedrooms} onChange={e => handleInputChange('bedrooms', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số phòng tắm</label><input type="number" style={styles.formInput} value={formData.bathrooms} onChange={e => handleInputChange('bathrooms', e.target.value)} /></div>
                     </div>
                     <div style={{...styles.formGrid, gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Hướng cửa</label>
                            <select style={styles.formInput} value={formData.doorDirection} onChange={e => handleInputChange('doorDirection', e.target.value)}><option value="">-- Chọn --</option>{DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Hướng ban công</label>
                            <select style={styles.formInput} value={formData.balconyDirection} onChange={e => handleInputChange('balconyDirection', e.target.value)}><option value="">-- Chọn --</option>{DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Hướng bếp</label>
                            <select style={styles.formInput} value={formData.kitchenDirection} onChange={e => handleInputChange('kitchenDirection', e.target.value)}><option value="">-- Chọn --</option>{DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                        </div>
                         <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Hướng nhà</label>
                            <select style={styles.formInput} value={formData.houseDirection} onChange={e => handleInputChange('houseDirection', e.target.value)}><option value="">-- Chọn --</option>{DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                        </div>
                     </div>
                     {isHouseLike && (
                         <div style={styles.formGrid}>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích đất (m²)</label><input type="number" style={styles.formInput} value={formData.landArea} onChange={e => handleInputChange('landArea', e.target.value)} /></div>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích xây dựng (m²)</label><input type="number" style={styles.formInput} value={formData.buildingArea} onChange={e => handleInputChange('buildingArea', e.target.value)} /></div>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng</label><input type="number" style={styles.formInput} value={formData.floors} onChange={e => handleInputChange('floors', e.target.value)} /></div>
                            <div style={styles.formGroup}><label style={styles.formLabel}>Chiều rộng mặt tiền (m)</label><input type="number" style={styles.formInput} value={formData.frontageWidth} onChange={e => handleInputChange('frontageWidth', e.target.value)} /></div>
                        </div>
                     )}
                </div>

                {/* THÔNG TIN CHI TIẾT */}
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>THÔNG TIN CHI TIẾT</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Mô tả</label>
                        <div style={styles.richTextContainer}>
                            <div style={styles.richTextToolbar}>Rich text editor toolbar</div>
                            <textarea style={styles.richTextEditor} value={formData.description} onChange={e => handleInputChange('description', e.target.value)}></textarea>
                        </div>
                    </div>
                     <div style={styles.formGroup}>
                        <label style={styles.formLabel}>File tài liệu đính kèm (pdf)</label>
                        <input type="file" style={styles.formInput} accept=".pdf" onChange={e => handleFileChange('document', e.target.files)} />
                    </div>
                </div>
                
                {/* GIÁ */}
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>GIÁ</h3>
                    <div style={{...styles.formGroup, maxWidth: '50%'}}>
                        <label style={styles.formLabel}>Giá cơ bản mặc định (VND)</label>
                        <input type="number" style={styles.formInput} placeholder="VD: 2500000000" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} />
                    </div>
                </div>

                {/* MEDIA */}
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>MEDIA</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Ảnh mặt bằng</label>
                        <input type="file" style={styles.formInput} accept="image/*" onChange={e => handleFileChange('floorPlanImage', e.target.files)} />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Thư viện ảnh</label>
                        <input type="file" multiple style={styles.formInput} accept="image/*" onChange={e => handleFileChange('gallery', e.target.files)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const BulkInventoryCreationView = ({ subdivision, unitTypes, onSave, onCancel }: { subdivision: any, unitTypes: any[], onSave: () => void, onCancel: () => void }) => {
    const [selectedUnitType, setSelectedUnitType] = useState(unitTypes.length > 0 ? unitTypes[0].id.toString() : '');
    const [fromFloor, setFromFloor] = useState('');
    const [toFloor, setToFloor] = useState('');
    const [excludeFloors, setExcludeFloors] = useState('');
    const [unitCodes, setUnitCodes] = useState('');
    const [status, setStatus] = useState('Đang mở bán');
    const [price, setPrice] = useState('');

    const handleSubmit = () => {
        if (!selectedUnitType || !fromFloor || !toFloor || !unitCodes) {
            alert('Vui lòng điền đầy đủ các trường trong mục "Tạo căn theo tầng".');
            return;
        }
        // Simple log for now, in a real app this would call an API
        console.log("Generating inventory with payload:", {
            subdivisionId: subdivision.id,
            unitTypeId: selectedUnitType,
            fromFloor,
            toFloor,
            excludeFloors,
            unitCodes,
            status,
            price
        });
        alert('Chức năng tạo giỏ hàng hàng loạt thành công! (Kiểm tra console log để xem dữ liệu)');
        onSave();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>
                    Tạo giỏ hàng hàng loạt: {subdivision.name}
                </h2>
                <div>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={onCancel}>Hủy</button>
                    <button style={styles.button} onClick={handleSubmit}>Lưu & Tạo</button>
                </div>
            </div>
            <div style={styles.formPageContainer}>
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>Chọn mẫu căn</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Mẫu căn hộ/nhà</label>
                        <select style={styles.formInput} value={selectedUnitType} onChange={e => setSelectedUnitType(e.target.value)}>
                            {unitTypes.map(ut => <option key={ut.id} value={ut.id}>{ut.name}</option>)}
                        </select>
                    </div>
                </div>

                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>TẠO CĂN THEO TẦNG</h3>
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Từ tầng</label>
                            <input type="number" style={styles.formInput} value={fromFloor} onChange={e => setFromFloor(e.target.value)} />
                        </div>
                         <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Đến tầng</label>
                            <input type="number" style={styles.formInput} value={toFloor} onChange={e => setToFloor(e.target.value)} />
                        </div>
                    </div>
                     <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Loại trừ các tầng</label>
                        <input type="text" style={styles.formInput} placeholder="Tách bằng dấu phẩy, ví dụ 12A, 14" value={excludeFloors} onChange={e => setExcludeFloors(e.target.value)} />
                    </div>
                     <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Mã căn</label>
                        <input type="text" style={styles.formInput} placeholder="Tách bằng dấu phẩy, ví dụ 01, 05, 08" value={unitCodes} onChange={e => setUnitCodes(e.target.value)} />
                    </div>
                </div>

                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>THÔNG TIN MẶC ĐỊNH</h3>
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Trạng thái giao dịch</label>
                            <select style={styles.formInput} value={status} onChange={e => setStatus(e.target.value)}>
                                <option>Đang mở bán</option>
                                <option>Sắp mở bán</option>
                                <option>Đã bán hết</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Giá cơ bản (VND)</label>
                            <input type="number" style={styles.formInput} placeholder="VD: 3000000000" value={price} onChange={e => setPrice(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const UnitTypesView = ({
    unitTypes,
    setView,
    onDelete
} : {
    unitTypes: any[],
    setView: (view: string, state?: any) => void;
    onDelete: (id: number) => void;
}) => {
    const [selectedIds, setSelectedIds] = useState(new Set<number>());
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [bedroomFilter, setBedroomFilter] = useState('all');
    const [bathroomFilter, setBathroomFilter] = useState('all');

    const filteredData = useMemo(() => {
        return unitTypes.filter(u => {
            const nameMatch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
            const typeMatch = typeFilter === 'all' || u.type === typeFilter;
            const bedroomMatch = bedroomFilter === 'all' || u.bedrooms === parseInt(bedroomFilter);
            const bathroomMatch = bathroomFilter === 'all' || u.bathrooms === parseInt(bathroomFilter);
            return nameMatch && typeMatch && bedroomMatch && bathroomMatch;
        });
    }, [unitTypes, searchTerm, typeFilter, bedroomFilter, bathroomFilter]);

    const handleSelectRow = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredData.map(u => u.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Bạn có chắc muốn xóa ${selectedIds.size} mẫu nhà đã chọn?`)) {
            selectedIds.forEach(id => onDelete(id));
            setSelectedIds(new Set());
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm(`Bạn có chắc muốn xóa mẫu nhà này?`)) {
            onDelete(id);
        }
    };

    const isAllSelected = selectedIds.size > 0 && selectedIds.size === filteredData.length;

    const uniqueTypes = [...new Set(mockUnitTypes.map(u => u.type))];
    const uniqueBedrooms = [...new Set(mockUnitTypes.map(u => u.bedrooms))].sort((a, b) => a - b);
    const uniqueBathrooms = [...new Set(mockUnitTypes.map(u => u.bathrooms))].sort((a, b) => a - b);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>Quản lý Mẫu nhà</h2>
                <div>
                    <button style={{ ...styles.actionButton, padding: '10px 15px', marginRight: '10px' }}><DownloadIcon /> Import (CSV)</button>
                    <button style={styles.button} onClick={() => setView('products.unittypes.add')}>Tạo mẫu nhà mới</button>
                </div>
            </div>

            <div style={{ ...styles.tableContainer, padding: '15px', marginBottom: '20px', backgroundColor: '#f8f9fa', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Tìm theo tên mẫu nhà..."
                        style={styles.formInput}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select style={styles.formInput} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="all">Tất cả loại hình</option>
                        {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select style={styles.formInput} value={bedroomFilter} onChange={e => setBedroomFilter(e.target.value)}>
                        <option value="all">Số phòng ngủ</option>
                        {uniqueBedrooms.map(b => <option key={b} value={b}>{b === 0 ? 'Studio' : `${b} PN`}</option>)}
                    </select>
                    <select style={styles.formInput} value={bathroomFilter} onChange={e => setBathroomFilter(e.target.value)}>
                        <option value="all">Số phòng tắm</option>
                        {uniqueBathrooms.map(b => <option key={b} value={b}>{`${b} PT`}</option>)}
                    </select>
                </div>
            </div>

            {selectedIds.size > 0 && (
                <div style={styles.bulkActionToolbar}>
                    <span style={{ fontWeight: 600 }}>{selectedIds.size} đã chọn</span>
                    <button style={styles.actionButton} onClick={handleBulkDelete}><TrashIcon /> Xóa</button>
                </div>
            )}

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, width: '50px' }}>
                                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                            </th>
                            <th style={styles.th}>Tên Mẫu nhà</th>
                            <th style={styles.th}>Loại hình BĐS</th>
                            <th style={styles.th}>Diện tích</th>
                            <th style={styles.th}>Phòng ngủ</th>
                            <th style={styles.th}>Phòng tắm</th>
                            <th style={styles.th}>Ngày tạo</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(unit => (
                            <tr key={unit.id} style={{ backgroundColor: selectedIds.has(unit.id) ? 'var(--active-item-bg)' : 'transparent' }}>
                                <td style={styles.td}>
                                    <input type="checkbox" checked={selectedIds.has(unit.id)} onChange={() => handleSelectRow(unit.id)} />
                                </td>
                                <td style={styles.td}>{unit.name}</td>
                                <td style={styles.td}>{unit.type}</td>
                                <td style={styles.td}>{unit.area}m²</td>
                                <td style={styles.td}>{unit.bedrooms}</td>
                                <td style={styles.td}>{unit.bathrooms}</td>
                                <td style={styles.td}>{formatDate(unit.createdAt).split(',')[1]}</td>
                                <td style={styles.td}>
                                    <button style={styles.actionButton} onClick={() => setView('products.unittypes.edit', { item: unit })}>Sửa</button>
                                    <button style={styles.actionButton} onClick={() => handleDelete(unit.id)}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const RetailPropertyManagementView = ({
    properties,
    projects,
    subdivisions,
    blocks,
    onDelete,
    onToggleVisibility,
    onBulkDelete,
    onBulkToggleVisibility,
} : {
    properties: any[],
    projects: any[],
    subdivisions: any[],
    blocks: any[],
    onDelete: (id: number) => void;
    onToggleVisibility: (id: number) => void;
    onBulkDelete: (ids: Set<number>) => void;
    onBulkToggleVisibility: (ids: Set<number>, visibility: boolean) => void;
}) => {
    const [selectedIds, setSelectedIds] = useState(new Set<number>());
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState('all');
    const [subdivisionFilter, setSubdivisionFilter] = useState('all');
    const [blockFilter, setBlockFilter] = useState('all');
    
    // Reset dependent filters when a parent filter changes
    const handleProjectFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProjectFilter(e.target.value);
        setSubdivisionFilter('all');
        setBlockFilter('all');
    };
    
    const handleSubdivisionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubdivisionFilter(e.target.value);
        setBlockFilter('all');
    };
    
    const availableSubdivisions = useMemo(() => {
        if (projectFilter === 'all') return subdivisions;
        return subdivisions.filter(s => s.projectId === parseInt(projectFilter));
    }, [projectFilter, subdivisions]);

    const availableBlocks = useMemo(() => {
        if (subdivisionFilter === 'all') {
            if (projectFilter === 'all') return blocks;
            const projectSubdivisionIds = subdivisions.filter(s => s.projectId === parseInt(projectFilter)).map(s => s.id);
            return blocks.filter(b => b.projectId === parseInt(projectFilter) && projectSubdivisionIds.includes(b.parentSubdivisionId));
        }
        return blocks.filter(b => b.parentSubdivisionId === parseInt(subdivisionFilter));
    }, [subdivisionFilter, projectFilter, blocks, subdivisions]);

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'all' || p.status === statusFilter;
            const typeMatch = typeFilter === 'all' || p.type === typeFilter;
            const projectMatch = projectFilter === 'all' || p.projectId === parseInt(projectFilter);
            const subdivisionMatch = subdivisionFilter === 'all' || p.subdivisionId === parseInt(subdivisionFilter);
            const blockMatch = blockFilter === 'all' || p.blockId === parseInt(blockFilter);
            
            return searchMatch && statusMatch && typeMatch && projectMatch && subdivisionMatch && blockMatch;
        });
    }, [properties, searchTerm, statusFilter, typeFilter, projectFilter, subdivisionFilter, blockFilter]);

    const handleSelectRow = (id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds(e.target.checked ? new Set(filteredProperties.map(p => p.id)) : new Set());
    };
    
    const handleBulkDelete = () => {
        onBulkDelete(selectedIds);
        setSelectedIds(new Set());
    };
    
    const handleBulkVisibility = (visibility: boolean) => {
        onBulkToggleVisibility(selectedIds, visibility);
        setSelectedIds(new Set());
    };

    const isAllSelected = selectedIds.size > 0 && selectedIds.size === filteredProperties.length;
    const uniqueTypes = [...new Set(properties.map(p => p.type))];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>Quản lý Bất động sản</h2>
                <div>
                    <button style={{ ...styles.actionButton, padding: '10px 15px', marginRight: '10px' }}><DownloadIcon /> Import (CSV)</button>
                    <button style={styles.button}>Tạo BĐS mới</button>
                </div>
            </div>

            {/* Filter Section */}
            <div style={{ ...styles.tableContainer, padding: '20px', marginBottom: '20px', backgroundColor: '#f8f9fa', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <input type="text" placeholder="Tìm theo Mã BĐS/Tên..." style={styles.formInput} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    <select style={styles.formInput} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">Tất cả trạng thái</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select style={styles.formInput} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="all">Tất cả loại hình</option>
                        {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <select style={styles.formInput} value={projectFilter} onChange={handleProjectFilterChange}>
                        <option value="all">Tất cả dự án</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select style={styles.formInput} value={subdivisionFilter} onChange={handleSubdivisionFilterChange} disabled={projectFilter === 'all'}>
                        <option value="all">Tất cả phân khu</option>
                        {availableSubdivisions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select style={styles.formInput} value={blockFilter} onChange={e => setBlockFilter(e.target.value)} disabled={subdivisionFilter === 'all'}>
                        <option value="all">Tất cả block</option>
                        {availableBlocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                 </div>
            </div>

            {selectedIds.size > 0 && (
                <div style={styles.bulkActionToolbar}>
                    <span style={{ fontWeight: 600 }}>{selectedIds.size} đã chọn</span>
                    <button style={styles.actionButton} onClick={handleBulkDelete}><TrashIcon /> Xóa</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                       <span style={{fontWeight: 500}}>Cài đặt hiển thị:</span>
                       <button style={{...styles.actionButton, padding: '8px 12px'}} onClick={() => handleBulkVisibility(true)}>Hiện</button>
                       <button style={{...styles.actionButton, padding: '8px 12px'}} onClick={() => handleBulkVisibility(false)}>Ẩn</button>
                    </div>
                </div>
            )}

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...styles.th, width: '50px' }}><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
                            <th style={styles.th}>Mã BĐS</th>
                            <th style={styles.th}>Tiêu đề</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Dự án / Phân khu / Block</th>
                            <th style={styles.th}>Giá (VND)</th>
                            <th style={styles.th}>Hiển thị</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProperties.map(prop => {
                            const project = projects.find(p => p.id === prop.projectId);
                            const subdivision = subdivisions.find(s => s.id === prop.subdivisionId);
                            const block = blocks.find(b => b.id === prop.blockId);
                            const hierarchy = [project?.name, subdivision?.name, block?.name].filter(Boolean).join(' / ');
                            return (
                                <tr key={prop.id} style={{ backgroundColor: selectedIds.has(prop.id) ? 'var(--active-item-bg)' : 'transparent' }}>
                                    <td style={styles.td}><input type="checkbox" checked={selectedIds.has(prop.id)} onChange={() => handleSelectRow(prop.id)} /></td>
                                    <td style={styles.td}>{prop.code}</td>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 500}}>{prop.title}</div>
                                        <div style={{fontSize: '12px', color: 'var(--text-secondary)'}}>Tên BĐS: {prop.name} - {prop.type}</div>
                                    </td>
                                    <td style={styles.td}>{prop.status}</td>
                                    <td style={styles.td}>{hierarchy || 'Không thuộc dự án'}</td>
                                    <td style={styles.td}>{formatPrice(prop.price)}</td>
                                    <td style={styles.td}><ToggleSwitch checked={prop.visible} onChange={() => onToggleVisibility(prop.id)} /></td>
                                    <td style={styles.td}>
                                        <button style={styles.actionButton}>Sửa</button>
                                        <button style={styles.actionButton} onClick={() => onDelete(prop.id)}>Xoá</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const NotificationManagementView = () => {
    const [notifications, setNotifications] = useState(mockNotifications);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{...styles.header, marginBottom: 0}}>Quản lý Thông báo</h2>
                <button style={styles.button}>Tạo mới</button>
            </div>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Tiêu đề</th>
                            <th style={styles.th}>Loại</th>
                            <th style={styles.th}>Đối tượng</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Ngày tạo</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications.map(noti => (
                            <tr key={noti.id}>
                                <td style={styles.td}>{noti.title}</td>
                                <td style={styles.td}>{noti.type}</td>
                                <td style={styles.td}>{noti.audience}</td>
                                <td style={styles.td}>{noti.status}</td>
                                <td style={styles.td}>{formatDate(noti.createdAt).split(',')[1]}</td>
                                <td style={styles.td}>
                                    <button style={styles.actionButton}><EditIcon/></button>
                                    <button style={styles.actionButton}><TrashIcon/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const TransactionManagementView = () => {
    // FIX: Replace `aistudio.useState` with `useState`.
    const [transactions, setTransactions] = useState(mockTransactions);
    
    return (
        <div>
            <h2 style={styles.header}>Quản lý Giao dịch</h2>
             <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Mã Giao dịch</th>
                            <th style={styles.th}>Mã Sản phẩm</th>
                            <th style={styles.th}>Dự án</th>
                            <th style={styles.th}>Khách hàng</th>
                            <th style={styles.th}>Số tiền</th>
                            <th style={styles.th}>Ngày</th>
                            <th style={styles.th}>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id}>
                                <td style={styles.td}>{tx.id}</td>
                                <td style={styles.td}>{tx.unitCode}</td>
                                <td style={styles.td}>{tx.projectName}</td>
                                <td style={styles.td}>{tx.customerName}</td>
                                <td style={styles.td}>{tx.amount}</td>
                                <td style={styles.td}>{tx.date}</td>
                                <td style={styles.td}>{tx.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AddProductModal = ({
    isOpen,
    onClose,
    productType, // 'project' or 'property' or 'unitType'
    allItems, // either all projects or all properties or all unit types
    alreadyAddedIds,
    onAddItems,
}: {
    isOpen: boolean;
    onClose: () => void;
    productType: 'project' | 'property' | 'unitType';
    allItems: any[];
    alreadyAddedIds: Set<number>;
    onAddItems: (items: any[]) => void;
}) => {
    if (!isOpen) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState(new Set<number>());

    const filteredItems = useMemo(() => {
        return allItems.filter(item => 
            (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [allItems, searchTerm]);

    const handleToggleSelect = (id: number) => {
        if (alreadyAddedIds.has(id)) return; // Can't select already added items
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleConfirmAdd = () => {
        const itemsToAdd = allItems.filter(item => selectedIds.has(item.id));
        onAddItems(itemsToAdd.map(item => {
            let finalType = '';
            const finalName = item.title || item.name;

            switch(productType) {
                case 'project': finalType = 'Dự án'; break;
                case 'property': finalType = 'Bất động sản'; break;
                case 'unitType': finalType = 'Mẫu nhà'; break;
            }

            return {
                id: item.id,
                name: finalName,
                type: finalType,
            };
        }));
        onClose();
    };

    const title =
        productType === 'project' ? 'Thêm dự án' :
        productType === 'property' ? 'Thêm Bất động sản' :
        'Thêm Mẫu nhà';

    return (
        <div style={styles.modalBackdrop}>
            <div style={{ ...styles.modalContent, maxWidth: '700px', height: '80vh', display: 'flex', flexDirection: 'column' }}>
                <h3 style={styles.modalHeader}>{title}</h3>
                <button style={styles.modalCloseButton} onClick={onClose}><XIcon /></button>
                <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    style={{...styles.formInput, marginBottom: '15px'}}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{...styles.th, width: '50px' }}></th>
                                <th style={styles.th}>Tên</th>
                                <th style={styles.th}>Loại</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(item => {
                                const isAdded = alreadyAddedIds.has(item.id);
                                return (
                                <tr key={item.id} 
                                    onClick={() => handleToggleSelect(item.id)}
                                    style={{
                                        cursor: isAdded ? 'not-allowed' : 'pointer',
                                        backgroundColor: selectedIds.has(item.id) ? 'var(--active-item-bg)' : 'transparent',
                                        opacity: isAdded ? 0.5 : 1,
                                    }}
                                >
                                    <td style={styles.td}>
                                        <input type="checkbox" checked={selectedIds.has(item.id)} readOnly disabled={isAdded}/>
                                    </td>
                                    <td style={styles.td}>{item.title || item.name}</td>
                                    <td style={styles.td}>{
                                        productType === 'project' ? 'Dự án' :
                                        productType === 'unitType' ? 'Mẫu nhà' :
                                        item.type
                                    }</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                <div style={styles.formFooter}>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={onClose}>Hủy</button>
                    <button style={{...styles.button, cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer', opacity: selectedIds.size === 0 ? 0.6 : 1}} onClick={handleConfirmAdd} disabled={selectedIds.size === 0}>Thêm ({selectedIds.size})</button>
                </div>
            </div>
        </div>
    );
};

const AddEditLivestreamView = ({
    mode,
    item,
    onSave,
    onCancel,
    allProjects,
    allProperties,
    allUnitTypes,
} : {
    mode: 'add' | 'edit';
    item: any | null;
    onSave: (data: any) => void;
    onCancel: () => void;
    allProjects: any[];
    allProperties: any[];
    allUnitTypes: any[];
}) => {
    const [formData, setFormData] = useState(item || {
        title: '',
        startTime: new Date().toISOString().slice(0, 16),
        youtubeLink: '',
        relatedProducts: [], // Will store objects like { id, name, type }
    });
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalProductType, setModalProductType] = useState<'project' | 'property' | 'unitType'>('project');
    
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOpenModal = (type: 'project' | 'property' | 'unitType') => {
        setModalProductType(type);
        setModalOpen(true);
    };
    
    const handleAddProducts = (newItems: any[]) => {
        const newProducts = [...formData.relatedProducts];
        const existingIds = new Set(newProducts.map(p => p.id));
        newItems.forEach(item => {
            if (!existingIds.has(item.id)) {
                newProducts.push(item);
            }
        });
        handleInputChange('relatedProducts', newProducts);
    };

    const handleRemoveProduct = (productId: number, productType: string) => {
        handleInputChange('relatedProducts', formData.relatedProducts.filter((p: any) => !(p.id === productId && p.type === productType)));
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.startTime || !formData.youtubeLink) {
            alert('Vui lòng điền đầy đủ Tiêu đề, Thời gian bắt đầu và Link YouTube.');
            return;
        }
        onSave(formData);
    };

    const relatedProductIds = useMemo(() => new Set(formData.relatedProducts.map((p: any) => p.id)), [formData.relatedProducts]);
    
    return (
        <div>
             <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                productType={modalProductType}
                allItems={
                    modalProductType === 'project' ? allProjects :
                    modalProductType === 'property' ? allProperties :
                    allUnitTypes
                }
                alreadyAddedIds={relatedProductIds}
                onAddItems={handleAddProducts}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ ...styles.header, marginBottom: 0 }}>
                    {mode === 'add' ? 'Tạo Livestream mới' : `Chỉnh sửa: ${item?.title}`}
                </h2>
                <div>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={onCancel}>Hủy</button>
                    <button style={styles.button} onClick={handleSubmit}>Lưu</button>
                </div>
            </div>

            <div style={styles.formPageContainer}>
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>Thông tin Livestream</h3>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Tiêu đề</label>
                        <input type="text" style={styles.formInput} value={formData.title} onChange={e => handleInputChange('title', e.target.value)} />
                    </div>
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Thời gian bắt đầu</label>
                            <input type="datetime-local" style={styles.formInput} value={formData.startTime} onChange={e => handleInputChange('startTime', e.target.value)} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Link YouTube</label>
                            <input type="text" style={styles.formInput} value={formData.youtubeLink} onChange={e => handleInputChange('youtubeLink', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div style={styles.formSection}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <h3 style={{...styles.formSectionHeader, border: 'none', margin: 0, padding: 0}}>Sản phẩm liên quan</h3>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button style={{...styles.actionButton, padding: '10px 15px'}} onClick={() => handleOpenModal('project')}>Thêm dự án</button>
                            <button style={{...styles.actionButton, padding: '10px 15px'}} onClick={() => handleOpenModal('property')}>Thêm Bất động sản</button>
                            <button style={{...styles.actionButton, padding: '10px 15px'}} onClick={() => handleOpenModal('unitType')}>Thêm Mẫu nhà</button>
                        </div>
                    </div>
                    
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Tên</th>
                                    <th style={styles.th}>Loại</th>
                                    <th style={{...styles.th, width: '100px'}}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.relatedProducts.length === 0 ? (
                                    <tr><td colSpan={3} style={{...styles.td, textAlign: 'center', color: 'var(--text-secondary)'}}>Chưa có sản phẩm nào.</td></tr>
                                ) : (
                                    formData.relatedProducts.map((prod: any, index: number) => (
                                        <tr key={`${prod.type}-${prod.id}-${index}`}>
                                            <td style={styles.td}>{prod.name}</td>
                                            <td style={styles.td}>{prod.type}</td>
                                            <td style={styles.td}>
                                                <button style={{...styles.actionButton, marginRight: 0}} onClick={() => handleRemoveProduct(prod.id, prod.type)}><TrashIcon /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LivestreamManagementView = ({ livestreams, onDeleteLivestream, setView }: { livestreams: any[], onDeleteLivestream: (id: number) => void, setView: (view: string, state?: any) => void }) => {
    const getStatus = (startTime: string) => {
        const now = new Date().getTime();
        const startDate = new Date(startTime).getTime();
        // Assume 2 hour duration for the livestream
        const endDate = startDate + (2 * 60 * 60 * 1000);

        if (now < startDate) {
            return { text: 'Chưa diễn ra', color: '#6c757d' };
        } else if (now >= startDate && now <= endDate) {
            return { text: 'Đang phát', color: 'var(--live-color)' };
        } else {
            return { text: 'Đã diễn ra', color: '#198754' };
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{...styles.header, marginBottom: 0}}>Quản lý Livestream</h2>
                <button style={styles.button} onClick={() => setView('livestream.add')}>Tạo Livestream</button>
            </div>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Tiêu đề</th>
                            <th style={styles.th}>Thời gian bắt đầu</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Sản phẩm liên quan</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {livestreams.map(ls => {
                            const statusInfo = getStatus(ls.startTime);
                            const isDeletable = statusInfo.text === 'Chưa diễn ra' || statusInfo.text === 'Đang phát';

                            return (
                                <tr key={ls.id}>
                                    <td style={styles.td}>{ls.title}</td>
                                    <td style={styles.td}>{formatDate(ls.startTime)}</td>
                                    <td style={styles.td}>
                                        <span style={{ fontWeight: 600, color: statusInfo.color }}>{statusInfo.text}</span>
                                    </td>
                                    <td style={styles.td}>{ls.relatedProducts.length}</td>
                                    <td style={styles.td}>
                                        <button style={styles.actionButton} onClick={() => setView('livestream.edit', { item: ls })}>Sửa</button>
                                        <button 
                                            style={{...styles.actionButton, cursor: isDeletable ? 'pointer' : 'not-allowed', opacity: isDeletable ? 1 : 0.5}} 
                                            onClick={() => isDeletable && onDeleteLivestream(ls.id)}
                                            disabled={!isDeletable}
                                        >
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const InboxView = () => {
    // FIX: Replace `aistudio.useState` with `useState`.
    const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
    
    if (!selectedConversation) {
        return <div><h2 style={styles.header}>Inbox</h2><p>No conversations found.</p></div>
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <h2 style={styles.header}>Inbox</h2>
            <div style={styles.inboxContainer}>
                <div style={styles.conversationList}>
                    {mockConversations.map(conv => (
                        <div 
                            key={conv.id} 
                            style={{
                                ...styles.conversationItem,
                                backgroundColor: selectedConversation.id === conv.id ? 'var(--active-item-bg)' : 'transparent',
                            }}
                            onClick={() => setSelectedConversation(conv)}
                        >
                            <div style={styles.avatar}>{conv.avatar}</div>
                            <div style={styles.conversationDetails}>
                                <p style={styles.customerName}>{conv.customerName}</p>
                                <p style={styles.lastMessage}>{conv.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={styles.chatWindow}>
                    <div style={styles.chatHeader}>{selectedConversation.customerName}</div>
                    <div style={styles.messageList}>
                        {mockMessages[selectedConversation.id as keyof typeof mockMessages].map((msg: any) => (
                            <div key={msg.id} style={{
                                ...styles.messageBubble,
                                ...(msg.sender === 'admin' ? styles.adminMessage : styles.customerMessage)
                            }}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div style={styles.messageInputContainer}>
                        <input type="text" style={styles.messageInput} placeholder="Type a message..." />
                        <button style={styles.sendButton}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- APP ---
const App = () => {
    // FIX: Replace `aistudio.useState` with `useState`.
    const [view, setViewRaw] = useState('dashboard');
    // FIX: Replace `aistudio.useState` with `useState`.
    const [viewState, setViewState] = useState<any>(null);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [projects, setProjects] = useState(mockProjects);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [subdivisions, setSubdivisions] = useState(mockSubdivisions);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [unitTypes, setUnitTypes] = useState(mockUnitTypes);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [retailProperties, setRetailProperties] = useState(mockRetailProperties);
    // FIX: Replace `aistudio.useState` with `useState`.
    const [livestreams, setLivestreams] = useState(mockLivestreams);

    // FIX: Replace `aistudio.useState` with `useState`.
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    const setView = (newView: string, state: any = null) => {
        setViewRaw(newView);
        setViewState(state);
    };

    const handleAddProject = (newProject: any) => {
        const projectWithId = { ...newProject, id: Date.now(), createdAt: new Date().toISOString() };
        setProjects(prev => [projectWithId, ...prev]);
        setView('products.projects.detail', { project: projectWithId });
    };
    
    const handleToggleProjectVisibility = (id: number) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
    };

    const handleDeleteProject = (project: any) => {
        if(window.confirm(`Bạn có chắc muốn xóa dự án "${project.name}"?`)){
            setProjects(prev => prev.filter(p => p.id !== project.id));
        }
    };
    
    const handleBulkDeleteProjects = (ids: Set<number>) => {
        if(window.confirm(`Bạn có chắc muốn xóa ${ids.size} dự án đã chọn?`)){
            setProjects(prev => prev.filter(p => !ids.has(p.id)));
        }
    };

    const handleBulkToggleProjectVisibility = (ids: Set<number>, visibility: boolean) => {
        setProjects(prev => prev.map(p => ids.has(p.id) ? { ...p, visible: visibility } : p));
    };
    
    const handleEditProject = (project: any) => {
        setView('products.projects.detail', { project });
    };
    
    const handleSaveSubdivisionBlock = (data: any, navigateAway = true) => {
        if(data.id) { // Editing
            const idToUpdate = data.id;
            setSubdivisions(prev => prev.map(s => s.id === idToUpdate ? {...s, ...data} : s));
             alert('Đã cập nhật!');
        } else { // Adding
            const newSubdivision = { ...data, id: Date.now(), createdAt: new Date().toISOString(), visible: true };
            setSubdivisions(prev => [newSubdivision, ...prev]);
             alert('Đã thêm mới!');
        }
        if (navigateAway) {
            const returnPath = data.category === 'block' ? 'products.buildings' : 'products.subdivisions';
            setView(returnPath);
        }
    };

    const handleDeleteSubdivisionBlock = (item: any) => {
        if(window.confirm(`Bạn có chắc muốn xóa "${item.name}"?`)){
            setSubdivisions(prev => prev.filter(s => s.id !== item.id));
        }
    };
    
    const handleToggleSubdivisionVisibility = (id: number) => {
        setSubdivisions(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    };

    const handleBulkDeleteSubdivisions = (ids: Set<number>) => {
        if(window.confirm(`Bạn có chắc muốn xóa ${ids.size} mục đã chọn?`)){
            setSubdivisions(prev => prev.filter(s => !ids.has(s.id)));
        }
    };

    const handleBulkToggleSubdivisionVisibility = (ids: Set<number>, visibility: boolean) => {
        setSubdivisions(prev => prev.map(s => ids.has(s.id) ? { ...s, visible: visibility } : s));
    };

    const handleSaveUnitType = (data: any) => {
        if (view.includes('.edit')) { // Editing
            const idToUpdate = viewState.item.id;
            setUnitTypes(prev => prev.map(u => u.id === idToUpdate ? {...u, ...data} : u));
            alert('Đã cập nhật Mẫu nhà!');
        } else { // Adding
            const newUnitType = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
            setUnitTypes(prev => [newUnitType, ...prev]);
            alert('Đã thêm Mẫu nhà mới!');
        }
        setView('products.unittypes');
    };

    const handleDeleteUnitType = (id: number) => {
        setUnitTypes(prev => prev.filter(u => u.id !== id));
    };

    const handleDeleteRetailProperty = (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa BĐS này?')) {
            setRetailProperties(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleToggleRetailPropertyVisibility = (id: number) => {
        setRetailProperties(prev => prev.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
    };

    const handleBulkDeleteRetailProperties = (ids: Set<number>) => {
        if (window.confirm(`Bạn có chắc muốn xóa ${ids.size} BĐS đã chọn?`)) {
            setRetailProperties(prev => prev.filter(p => !ids.has(p.id)));
        }
    };

    // FIX: Correctly use the `visibility` parameter to update the `visible` property. The shorthand `visible` was causing an error.
    const handleBulkToggleRetailPropertyVisibility = (ids: Set<number>, visibility: boolean) => {
        setRetailProperties(prev => prev.map(p => ids.has(p.id) ? { ...p, visible: visibility } : p));
    };

    const handleDeleteLivestream = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lịch này không? Nếu xóa thì tại app sẽ không hiển thị livestream này nữa')) {
            setLivestreams(prev => prev.filter(ls => ls.id !== id));
        }
    };
    
    const handleSaveLivestream = (data: any) => {
        // Convert related products from objects back to IDs for storing in mock data
        const processedData = {
            ...data,
            relatedProducts: data.relatedProducts.map((p: any) => p.id)
        };

        if (processedData.id) { // Editing
             setLivestreams(prev => prev.map(ls => ls.id === processedData.id ? processedData : ls));
             alert('Đã cập nhật Livestream!');
        } else { // Adding
            const newLivestream = { 
                ...processedData, 
                id: Date.now(),
            };
            setLivestreams(prev => [newLivestream, ...prev]);
            alert('Đã tạo Livestream mới!');
        }
        setView('livestream');
    };


    const renderView = () => {
        if (view.startsWith('products.projects')) {
            const project = viewState?.project;
            if (view === 'products.projects.add') {
                return <AddProjectView onAddProject={handleAddProject} setView={setView} />;
            }
            if (project) {
                return <ProjectDetailView project={project} setView={setView} />;
            }
            return <ProjectManagementView
                        projects={projects}
                        setView={setView}
                        onToggleVisibility={handleToggleProjectVisibility}
                        onEditProject={handleEditProject}
                        onDeleteProject={handleDeleteProject}
                        onBulkDelete={handleBulkDeleteProjects}
                        onBulkToggleVisibility={handleBulkToggleProjectVisibility}
                    />;
        }
        
         if (view.startsWith('products.subdivisions')) {
             if (view === 'products.subdivisions.add') {
                return <AddEditSubdivisionBlockView
                            mode='add'
                            item={null}
                            onSave={handleSaveSubdivisionBlock}
                            onCancel={() => setView('products.subdivisions')}
                            category="subdivision"
                            projects={projects}
                        />
             }
              if (view === 'products.subdivisions.inventory.bulk-add') {
                return <BulkInventoryCreationView
                            subdivision={viewState.subdivision}
                            unitTypes={unitTypes}
                            onSave={() => setView('products.subdivisions.edit', { item: viewState.subdivision })}
                            onCancel={() => setView('products.subdivisions.edit', { item: viewState.subdivision })}
                        />;
             }
             if (view === 'products.subdivisions.edit') {
                return <SubdivisionDetailView
                           item={viewState.item}
                           setView={setView}
                           subdivisions={subdivisions}
                           onSave={(data) => handleSaveSubdivisionBlock(data, false)}
                           onDelete={handleDeleteSubdivisionBlock}
                           onEdit={(item) => setView('products.buildings.edit', { item })}
                       />;
             }
             const subdivisionData = subdivisions.filter(s => s.category === 'subdivision');
             return <SubdivisionManagementView 
                        subdivisions={subdivisionData}
                        onAdd={() => setView('products.subdivisions.add')}
                        onDelete={handleDeleteSubdivisionBlock}
                        onEdit={(item) => setView('products.subdivisions.edit', { item })}
                        onToggleVisibility={handleToggleSubdivisionVisibility}
                        onBulkDelete={handleBulkDeleteSubdivisions}
                        onBulkToggleVisibility={handleBulkToggleSubdivisionVisibility}
                    />;
        }

        if (view.startsWith('products.buildings')) {
             if (view === 'products.buildings.add' || view === 'products.buildings.edit') {
                const subdivisionData = subdivisions.filter(s => s.category === 'subdivision');
                return <AddEditSubdivisionBlockView
                            mode={view === 'products.buildings.add' ? 'add' : 'edit'}
                            item={viewState?.item || null}
                            onSave={handleSaveSubdivisionBlock}
                            onCancel={() => setView('products.buildings')}
                            category="block"
                            projects={projects}
                            subdivisions={subdivisionData}
                        />
             }
             const buildingData = subdivisions.filter(s => s.category === 'block');
             const subdivisionData = subdivisions.filter(s => s.category === 'subdivision');
             return <BuildingManagementView
                        buildings={buildingData}
                        subdivisions={subdivisionData}
                        onAdd={() => setView('products.buildings.add')}
                        onDelete={handleDeleteSubdivisionBlock}
                        onEdit={(item) => setView('products.buildings.edit', { item })}
                        onToggleVisibility={handleToggleSubdivisionVisibility}
                        onBulkDelete={handleBulkDeleteSubdivisions}
                        onBulkToggleVisibility={handleBulkToggleSubdivisionVisibility}
                    />;
        }

        if (view.startsWith('products.unittypes')) {
            if (view === 'products.unittypes.add' || view === 'products.unittypes.edit') {
                return <AddEditUnitTypeView
                            mode={view === 'products.unittypes.add' ? 'add' : 'edit'}
                            item={viewState?.item || null}
                            onSave={handleSaveUnitType}
                            onCancel={() => setView('products.unittypes')}
                        />;
            }
             return <UnitTypesView
                        unitTypes={unitTypes}
                        setView={setView}
                        onDelete={handleDeleteUnitType}
                    />;
        }
        
        if (view.startsWith('livestream')) {
            if (view === 'livestream.add' || view === 'livestream.edit') {
                 const itemToEdit = viewState?.item ? { ...viewState.item } : null;

                 if (itemToEdit) {
                    const allProductsForLookup = [...projects, ...retailProperties, ...unitTypes];
                    const relatedProductsAsObjects = itemToEdit.relatedProducts
                        .map((id: number) => {
                            const product = allProductsForLookup.find(p => p.id === id);
                            if (!product) return null;
                            
                            if ('investor' in product) { // Project
                                return { id: product.id, name: product.name, type: 'Dự án' };
                            } else if ('bedrooms' in product) { // UnitType
                                return { id: product.id, name: product.name, type: 'Mẫu nhà' };
                            } else if ('code' in product) { // RetailProperty
                                return { id: product.id, name: product.title || product.name, type: 'Bất động sản' };
                            }
                            return null;
                        })
                        .filter(Boolean);
                    itemToEdit.relatedProducts = relatedProductsAsObjects;
                 }

                return <AddEditLivestreamView
                    mode={view === 'livestream.add' ? 'add' : 'edit'}
                    item={itemToEdit}
                    onSave={handleSaveLivestream}
                    onCancel={() => setView('livestream')}
                    allProjects={projects}
                    allProperties={retailProperties}
                    allUnitTypes={unitTypes}
                />;
            }
        }

        switch (view) {
            case 'dashboard': return <DashboardView />;
            case 'users': return <UserManagementView />;
            case 'products.properties': 
                return <RetailPropertyManagementView
                    properties={retailProperties}
                    projects={projects}
                    subdivisions={subdivisions.filter(s => s.category === 'subdivision')}
                    blocks={subdivisions.filter(s => s.category === 'block')}
                    onDelete={handleDeleteRetailProperty}
                    onToggleVisibility={handleToggleRetailPropertyVisibility}
                    onBulkDelete={handleBulkDeleteRetailProperties}
                    onBulkToggleVisibility={handleBulkToggleRetailPropertyVisibility}
                />;
            case 'transactions': return <TransactionManagementView />;
            case 'livestream': return <LivestreamManagementView livestreams={livestreams} onDeleteLivestream={handleDeleteLivestream} setView={setView} />;
            case 'inbox': return <InboxView />;
            case 'notifications': return <NotificationManagementView />;
            default: return <DashboardView />;
        }
    };

    return (
        <div style={styles.appContainer}>
            <Sidebar activeView={view} setView={setView} isCollapsed={isSidebarCollapsed} setCollapsed={setSidebarCollapsed} />
            <main style={styles.mainContent}>
                {renderView()}
            </main>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}