import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

type View = 'dashboard' | 'users' | 'products.projects' | 'products.projects.add' | 'products.projects.detail' | 'products.projects.detail.addBlock' | 'products.retail' | 'discounts' | 'livestream' | 'inbox';

// --- MOCK DATA ---
const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'vana@example.com', phone: '0901234567', role: 'Quản trị' },
    { id: 2, name: 'Trần Thị B', email: 'thib@example.com', phone: '0912345678', role: 'Đại lý' },
    { id: 3, name: 'Lê Văn C', email: 'vanc@example.com', phone: '0923456789', role: 'Môi giới' },
    { id: 4, name: 'Công ty BĐS ABC', email: 'abc@agency.com', phone: '0987654321', role: 'Đại lý' },
];

const mockProjects = [
    { id: 1, name: 'Vinhomes Grand Park', investor: 'Vingroup', location: 'Quận 9, TP. HCM', coordinates: '10.8411, 106.8099', description: 'Đại đô thị thông minh', landArea: 2710000, buildArea: 542000, email: 'info@vinhomes.vn', facebook: 'fb.com/vinhomes', tiktok: 'tiktok.com/@vinhomes', status: 'Đang bán', visible: true },
    { id: 2, name: 'The Origami', investor: 'Vingroup', location: 'Quận 9, TP. HCM', coordinates: '10.8411, 106.8099', description: 'Phân khu phong cách Nhật Bản', landArea: 260000, buildArea: 52000, email: 'info@origami.vn', facebook: '', tiktok: '', status: 'Đã bán', visible: true },
    { id: 3, name: 'Masteri Centre Point', investor: 'Masterise Homes', location: 'Quận 9, TP. HCM', coordinates: '10.8411, 106.8099', description: 'Khu căn hộ cao cấp', landArea: 70000, buildArea: 14000, email: 'info@masterise.vn', facebook: 'fb.com/masterise', tiktok: '', status: 'Sắp mở bán', visible: false },
];

const mockSubdivisions = [
    { id: 1, projectId: 1, name: 'The Rainbow' },
    { id: 2, projectId: 1, name: 'The Origami' },
    { id: 3, projectId: 1, name: 'The Manhattan' },
];

const mockBlocks = [
    { id: 1, projectId: 1, subdivisionId: 1, name: 'Tòa S1.01', type: 'Tòa nhà Căn hộ', visible: true },
    { id: 2, projectId: 1, subdivisionId: 1, name: 'Tòa S2.05', type: 'Tòa nhà Căn hộ', visible: true },
    { id: 3, projectId: 1, subdivisionId: 3, name: 'Khu biệt thự The Manhattan', type: 'Khu biệt thự', visible: false },
];

const mockFloorPlans = [
    { id: 1, projectId: 1, code: 'C1-A', description: 'Căn hộ 1PN+1', area: 55 },
    { id: 2, projectId: 1, code: 'C2-B', description: 'Căn hộ 2PN', area: 75 },
];

const mockProjectAgencies = [
    { projectId: 1, agencyId: 2 },
    { projectId: 1, agencyId: 4 },
];


const mockRetailProperties = [
    { id: 1, name: 'Biệt thự Thảo Điền', address: 'Quận 2, TP. HCM', price: '150 tỷ', type: 'Biệt thự', status: 'Đang bán' },
    { id: 2, name: 'Nhà phố trung tâm', address: 'Quận 1, TP. HCM', price: '50 tỷ', type: 'Nhà phố', status: 'Đã bán' },
    { id: 3, name: 'Căn hộ dịch vụ', address: 'Quận 7, TP. HCM', price: '5 tỷ', type: 'Căn hộ', status: 'Đang cho thuê' },
];


const mockDiscounts = [
    { id: 1, code: 'SALE50', description: 'Giảm 50% cho lần mua đầu', discount: '50%', expiry: '31/12/2024', status: 'Còn hiệu lực' },
    { id: 2, code: 'WELCOME10', description: 'Giảm 10% cho khách hàng mới', discount: '10%', expiry: '30/11/2024', status: 'Còn hiệu lực' },
    { id: 3, code: 'OLDCODE', description: 'Mã giảm giá cũ', discount: '5%', expiry: '01/01/2024', status: 'Hết hạn' },
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

// --- ICONS ---
const Icon = ({ path, size = 22, style }: { path: React.ReactNode; size?: number; style?: React.CSSProperties }) => (
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
const DiscountIcon = () => <Icon path={<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></>} />;
const LivestreamIcon = () => <Icon path={<><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></>} />;
const InboxIcon = () => <Icon path={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></>} />;
const ChevronLeftIcon = () => <Icon path={<polyline points="15 18 9 12 15 6"></polyline>} />;
const ChevronRightIcon = () => <Icon path={<polyline points="9 18 15 12 9 6"></polyline>} />;
const TrashIcon = () => <Icon path={<polyline points="3 6 5 6 21 6"></polyline>} size={18} />;
const EditIcon = () => <Icon path={<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>} size={18} />;
const XIcon = () => <Icon path={<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>} size={20} />;

// --- STYLES ---
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

const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <div style={styles.toggleSwitch} onClick={onChange}>
            <div style={{...styles.toggleSwitchSlider, backgroundColor: checked ? 'var(--button-bg)' : '#ccc'}}></div>
            <div style={{...styles.toggleSwitchKnob, transform: checked ? 'translateX(20px)' : 'translateX(0)'}}></div>
        </div>
    );
};

const Sidebar = ({ activeView, setView, isCollapsed, setCollapsed }: { activeView: View; setView: (view: View) => void; isCollapsed: boolean; setCollapsed: (isCollapsed: boolean) => void; }) => {
    const [isProductsOpen, setProductsOpen] = useState(activeView.startsWith('products.'));

    const handleNavClick = (view: View) => {
        if (view === 'products.projects' || view === 'products.retail') {
            setProductsOpen(true);
        }
        setView(view);
    };

    const toggleProductsMenu = () => {
        if (isCollapsed) {
            setCollapsed(false);
            setProductsOpen(true);
        } else {
            setProductsOpen(!isProductsOpen);
        }
    };

    const navItems = [
        { id: 'dashboard', label: 'Tổng quan', icon: <DashboardIcon /> },
        { id: 'users', label: 'Quản lý người dùng', icon: <UsersIcon /> },
        {
            id: 'products', label: 'Sản phẩm', icon: <ProductsIcon />, subItems: [
                { id: 'products.projects', label: 'Dự án' },
                { id: 'products.retail', label: 'Bất động sản lẻ' },
            ]
        },
        { id: 'discounts', label: 'Quản lý giảm giá', icon: <DiscountIcon /> },
        { id: 'livestream', label: 'Livestream', icon: <LivestreamIcon /> },
        { id: 'inbox', label: 'Inbox', icon: <InboxIcon /> },
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
                            }}
                            onClick={() => item.subItems ? toggleProductsMenu() : handleNavClick(item.id as View)}
                            role="button"
                            aria-current={activeView === item.id}
                            title={isCollapsed ? item.label : ''}
                        >
                            {item.icon}
                            {!isCollapsed && <span>{item.label}</span>}
                        </div>
                        {!isCollapsed && item.subItems && isProductsOpen && (
                            <div>
                                {item.subItems.map(subItem => (
                                    <div
                                        key={subItem.id}
                                        style={{
                                            ...styles.subNavItem,
                                            backgroundColor: activeView === subItem.id ? 'var(--active-item-bg)' : 'transparent',
                                            fontWeight: activeView === subItem.id ? 600 : 400,
                                        }}
                                        onClick={() => handleNavClick(subItem.id as View)}
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
                <h3 style={styles.cardTitle}>Mã giảm giá</h3>
                <p style={styles.cardValue}>{mockDiscounts.filter(d => d.status === 'Còn hiệu lực').length}</p>
            </div>
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Tin nhắn chưa đọc</h3>
                <p style={styles.cardValue}>1</p>
            </div>
        </div>
    </div>
);

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
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
    const [users, setUsers] = useState(mockUsers);
    const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
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
    
    const handleAddUser = (newUser) => {
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

const AddProjectView = ({ onAddProject, setView }) => {
    const [name, setName] = useState('');
    const [investor, setInvestor] = useState('');
    const [managementUnit, setManagementUnit] = useState('');
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const [description, setDescription] = useState('');
    const [landArea, setLandArea] = useState('');
    const [buildArea, setBuildArea] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [facebook, setFacebook] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [gallery, setGallery] = useState<FileList | null>(null);
    const [infoPdf, setInfoPdf] = useState<File | null>(null);
    const [masterPlan, setMasterPlan] = useState<File | null>(null);
    const [status, setStatus] = useState('Đang cập nhật');
    const [isVisible, setIsVisible] = useState(true);

    const STATUS_OPTIONS = [
        "Đang cập nhật",
        "Sắp mở bán",
        "Đang mở bán",
        "Đang xây dựng",
        "Đã bàn giao",
        "Đã bán hết",
        "Tạm dừng",
    ];

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
                    <div style={styles.formGrid}>
                        <div style={{...styles.formGroup, marginBottom: 0}}>
                            <label style={styles.formLabel}>Địa chỉ dự án</label>
                            <input type="text" style={styles.formInput} value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                        <div style={{...styles.formGroup, marginBottom: 0}}>
                            <label style={styles.formLabel}>Tọa độ</label>
                            <input type="text" style={styles.formInput} value={coordinates} onChange={e => setCoordinates(e.target.value)} placeholder="e.g., 10.7769, 106.7009"/>
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
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Trạng thái dự án</label>
                        <select style={styles.formInput} value={status} onChange={e => setStatus(e.target.value)}>
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>File thông tin đính kèm (pdf)</label>
                        <input type="file" style={styles.formInput} accept=".pdf" onChange={e => setInfoPdf(e.target.files ? e.target.files[0] : null)} />
                    </div>
                </div>

                {/* Section 3: Images */}
                <div style={styles.formSection}>
                     <h3 style={styles.formSectionHeader}>Hình ảnh</h3>
                     <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Mặt bằng tổng thể dự án</label>
                        <input type="file" style={styles.formInput} accept="image/*" onChange={e => setMasterPlan(e.target.files ? e.target.files[0] : null)} />
                     </div>
                     <div style={styles.formGrid}>
                         <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Ảnh thumbnail</label>
                            <input type="file" style={styles.formInput} accept="image/*" onChange={e => setThumbnail(e.target.files ? e.target.files[0] : null)} />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.formLabel}>Thư viện hình ảnh</label>
                            <input type="file" multiple style={styles.formInput} accept="image/*" onChange={e => setGallery(e.target.files)} />
                        </div>
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

const ProjectManagementView = ({ projects, setView, onToggleVisibility, onEditProject }) => {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{...styles.header, marginBottom: 0}}>Quản lý Dự án</h2>
                <button style={styles.button} onClick={() => setView('products.projects.add')}>Thêm dự án</button>
            </div>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Tên dự án</th>
                            <th style={styles.th}>Chủ đầu tư</th>
                            <th style={styles.th}>Vị trí</th>
                            <th style={styles.th}>Trạng thái</th>
                            <th style={styles.th}>Hiển thị</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project.id}>
                                <td style={styles.td}>{project.name}</td>
                                <td style={styles.td}>{project.investor}</td>
                                <td style={styles.td}>{project.location}</td>
                                <td style={styles.td}>{project.status}</td>
                                <td style={styles.td}>
                                    <ToggleSwitch 
                                        checked={project.visible} 
                                        onChange={() => onToggleVisibility(project.id)} 
                                    />
                                </td>
                                <td style={styles.td}>
                                    <button style={styles.actionButton} onClick={() => onEditProject(project)}>Sửa</button>
                                    <button style={styles.actionButton}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const allAmenities = [
    "Sảnh Lễ tân & Lounge", "Hồ bơi người lớn", "Hồ bơi trẻ em", "Jacuzzi",
    "Sân tắm nắng", "Khu BBQ ngoài trời", "Sân chơi trẻ em", "Phòng Gym",
    "Phòng Yoga/Thiền", "Phòng xông hơi", "Phòng sinh hoạt cộng đồng",
    "Thư viện/Phòng đọc", "Vườn trên mái", "Đường dạo bộ nội khu",
    "An ninh 24/7", "Hệ thống Camera giám sát", "Bãi đỗ xe thông minh",
    "Hệ thống PCCC tiêu chuẩn", "Máy phát điện dự phòng 100%", "Internet tốc độ cao"
];

const AmenitiesModal = ({ isOpen, onClose, selectedAmenities, onSave }) => {
    if (!isOpen) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [currentSelection, setCurrentSelection] = useState(new Set(selectedAmenities));

    const handleToggle = (amenity) => {
        setCurrentSelection(prev => {
            const newSet = new Set(prev);
            if (newSet.has(amenity)) {
                newSet.delete(amenity);
            } else {
                newSet.add(amenity);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        onSave(Array.from(currentSelection));
        onClose();
    };

    const filteredAmenities = allAmenities.filter(a =>
        a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const modalContentStyle: React.CSSProperties = {
        ...styles.modalContent,
        maxWidth: '600px',
    };
    
    const amenitiesListStyle: React.CSSProperties = {
        maxHeight: '40vh',
        overflowY: 'auto',
        border: '1px solid var(--border-color)',
        borderRadius: '6px',
        padding: '10px',
    };

    const amenityItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        cursor: 'pointer',
        borderRadius: '4px',
    };

    return (
        <div style={styles.modalBackdrop} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                <h3 style={styles.modalHeader}>Chọn tiện ích nội khu</h3>
                <button style={styles.modalCloseButton} onClick={onClose}><XIcon /></button>
                <div style={styles.formGroup}>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm tiện ích..." 
                        style={styles.formInput} 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                </div>
                <div style={amenitiesListStyle}>
                    {filteredAmenities.map(amenity => (
                        <div 
                            key={amenity} 
                            style={amenityItemStyle} 
                            onClick={() => handleToggle(amenity)}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--active-item-bg)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                            <input 
                                type="checkbox" 
                                style={{marginRight: '10px', width: '16px', height: '16px'}}
                                checked={currentSelection.has(amenity)} 
                                readOnly
                            />
                            <label>{amenity}</label>
                        </div>
                    ))}
                </div>
                <div style={styles.formFooter}>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={onClose}>Hủy</button>
                    <button style={styles.button} onClick={handleSave}>Lưu ({currentSelection.size})</button>
                </div>
            </div>
        </div>
    );
};


const AddBlockView = ({ project, setView, onAddBlock }) => {
    const projectSubdivisions = mockSubdivisions.filter(s => s.projectId === project.id);
    
    // General Info State
    const [subdivisionId, setSubdivisionId] = useState('');
    const [blockName, setBlockName] = useState('');
    const [blockCode, setBlockCode] = useState('');
    const [blockType, setBlockType] = useState('');
    const [status, setStatus] = useState('Sắp mở bán');
    const [completionYear, setCompletionYear] = useState(new Date().getFullYear() + 2);
    const [managementUnit, setManagementUnit] = useState('');
    const [description, setDescription] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);

    // Technical Specs State
    const [techSpecs, setTechSpecs] = useState({});

    const handleTechSpecChange = (field, value) => {
        setTechSpecs(prev => ({...prev, [field]: value}));
    };

    const BLOCK_TYPE_OPTIONS = [
        "Tòa chung cư", 
        "Tòa Condotel", 
        "Khu biệt thự", 
        "Khu nhà liền kề", 
        "Khu Shophouse"
    ];

    const STATUS_OPTIONS = [
        "Sắp mở bán", 
        "Đang mở bán", 
        "Đã bàn giao", 
        "Đã bán hết"
    ];

    const handleSubmit = () => {
        if (!blockName || !blockType) {
            alert('Vui lòng điền các trường bắt buộc: Tên khối, Loại hình.');
            return;
        }
        const newBlock = {
            projectId: project.id,
            subdivisionId: subdivisionId ? parseInt(String(subdivisionId), 10) : null,
            name: blockName,
            code: blockCode,
            type: blockType,
            status,
            completionYear,
            managementUnit,
            description,
            amenities: selectedAmenities,
            ...techSpecs,
        };
        onAddBlock(newBlock);
    };
    
    const renderTechSpecs = () => {
        const isApartment = blockType === "Tòa chung cư" || blockType === "Tòa Condotel";
        const isVilla = blockType === "Khu biệt thự";
        const isTownhouse = blockType === "Khu nhà liền kề";
        const isShophouse = blockType === "Khu Shophouse";

        if (!blockType) return null;

        return (
            <>
                {isApartment && (
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng nổi</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('floorsAboveGround', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng hầm</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('basementFloors', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng căn hộ</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('apartmentFloors', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số lượng căn hộ mỗi tầng</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('unitsPerFloor', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số lượng căn hộ</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('totalUnits', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số lượng thang máy</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('elevators', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích khu đất (khối đế) (m²)</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('podiumArea', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích sàn xây dựng (m²)</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('gfa', e.target.value)} /></div>
                    </div>
                )}
                {(isVilla || isTownhouse || isShophouse) && (
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Tổng diện tích khu đất</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('totalLandArea', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Mật độ xây dựng</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('buildingDensity', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Tổng số căn</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('totalVillas', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Diện tích cây xanh và mặt nước</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('greenArea', e.target.value)} /></div>
                     </div>
                )}
                 {(isTownhouse || isShophouse) && (
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Bề rộng mặt tiền (điển hình)</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('facadeWidth', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Số tầng xây dựng (điển hình)</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('typicalFloors', e.target.value)} /></div>
                     </div>
                )}
                {isShophouse && (
                     <div style={styles.formGrid}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Chiều cao trần Tầng 1</label><input type="number" style={styles.formInput} onChange={e => handleTechSpecChange('floor1CeilingHeight', e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Thiết kế Lối đi</label><input type="text" style={styles.formInput} onChange={e => handleTechSpecChange('walkwayDesign', e.target.value)} /></div>
                        <div style={{...styles.formGroup, gridColumn: 'span 2'}}><label style={styles.formLabel}>Quy hoạch Bãi đỗ xe (Cho khách)</label><input type="text" style={styles.formInput} onChange={e => handleTechSpecChange('guestParking', e.target.value)} /></div>
                     </div>
                )}
            </>
        );
    };


    return (
        <div>
            <AmenitiesModal 
                isOpen={isAmenitiesModalOpen}
                onClose={() => setIsAmenitiesModalOpen(false)}
                selectedAmenities={selectedAmenities}
                onSave={setSelectedAmenities}
            />
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setView('products.projects.detail')} style={{...styles.actionButton, border: 'none', padding: '5px 0', marginBottom: '10px'}}>
                    &larr; Quay lại chi tiết dự án
                </button>
                <h2 style={{...styles.header, marginBottom: 0 }}>Tạo khối bất động sản mới</h2>
            </div>
             <div style={styles.formPageContainer}>
                {/* Section 1: General Info */}
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionHeader}>Thông tin chung</h3>
                    <div style={styles.formGrid}>
                        <div style={{...styles.formGroup, gridColumn: 'span 2'}}><label style={styles.formLabel}>Tên thương mại</label><input type="text" style={styles.formInput} value={blockName} onChange={e => setBlockName(e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Thuộc phân khu nào</label><select style={styles.formInput} value={subdivisionId} onChange={e => setSubdivisionId(e.target.value)}><option value="">-- Không thuộc phân khu nào --</option>{projectSubdivisions.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}</select></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Mã khối</label><input type="text" style={styles.formInput} value={blockCode} onChange={e => setBlockCode(e.target.value)} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Loại hình</label><select style={styles.formInput} value={blockType} onChange={e => setBlockType(e.target.value)}><option value="" disabled>-- Chọn loại hình --</option>{BLOCK_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Năm hoàn thành</label><input type="number" style={styles.formInput} value={completionYear} onChange={e => setCompletionYear(parseInt(e.target.value, 10))} /></div>
                    </div>
                     <div style={styles.formGroup}><label style={styles.formLabel}>Đơn vị quản lý vận hành</label><input type="text" style={styles.formInput} value={managementUnit} onChange={e => setManagementUnit(e.target.value)} /></div>
                     <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Mô tả</label>
                        <div style={styles.richTextContainer}>
                            <div style={styles.richTextToolbar}>Bold, Italic, Underline... (Rich text support)</div>
                            <textarea style={styles.richTextEditor} value={description} onChange={e => setDescription(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Ảnh đại diện</label><input type="file" accept="image/*" style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Thư viện ảnh</label><input type="file" multiple accept="image/*" style={styles.formInput} /></div>
                    </div>
                    <div style={styles.formGroup}><label style={styles.formLabel}>File đính kèm (PDF)</label><input type="file" accept=".pdf" style={styles.formInput} /></div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Tiện ích nội khu</label>
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center'}}>
                             {selectedAmenities.length > 0 && selectedAmenities.map(amenity => (
                                <span key={amenity} style={{backgroundColor: 'var(--active-item-bg)', padding: '5px 10px', borderRadius: '15px', fontSize: '13px'}}>{amenity}</span>
                             ))}
                            <button onClick={() => setIsAmenitiesModalOpen(true)} style={{...styles.actionButton, padding: '5px 15px'}}>Chọn tiện ích...</button>
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Tình trạng</label>
                        <select style={styles.formInput} value={status} onChange={e => setStatus(e.target.value)}>
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>

                {/* Section 2: Technical Specifications (Conditional) */}
                {blockType && (
                    <div style={styles.formSection}>
                        <h3 style={styles.formSectionHeader}>Thông số Kỹ thuật</h3>
                        {renderTechSpecs()}
                    </div>
                )}
                
                <div style={styles.formFooter}>
                    <button style={{ ...styles.actionButton, padding: '10px 20px' }} onClick={() => setView('products.projects.detail')}>Hủy</button>
                    <button style={styles.button} onClick={handleSubmit}>Lưu</button>
                </div>
            </div>
        </div>
    );
};


// --- PROJECT DETAIL VIEW AND TABS ---

const OverviewTab = ({ project }) => {
    // In a real app, you would manage state for each field to make them editable.
    // For this example, we'll just display the data in form inputs.
    const STATUS_OPTIONS = [
        "Đang cập nhật", "Sắp mở bán", "Đang mở bán", "Đang xây dựng",
        "Đã bàn giao", "Đã bán hết", "Tạm dừng",
    ];
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
                        <label style={styles.formLabel}>Ảnh thumbnail</label>
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

const TabularDataManagement = ({
    title,
    columns,
    data,
    onAdd,
    onImport,
    onDelete,
    onBulkDelete,
    selectedIds,
    onSelectRow,
    onSelectAll,
    isAllSelected,
    description,
}) => {
    const hasSelection = selectedIds && selectedIds.size > 0;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                {hasSelection ? (
                    <div style={{...styles.bulkActionToolbar, width: '100%', justifyContent: 'flex-start', margin: 0}}>
                         <span style={{ fontWeight: 600 }}>{selectedIds.size} đã chọn</span>
                         <button style={styles.actionButton} onClick={onBulkDelete}><TrashIcon/> Xóa</button>
                    </div>
                ) : (
                    <>
                        <div>
                             <h3 style={{ margin: 0, fontSize: '20px' }}>{title}</h3>
                             {description && <p style={{margin: '5px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.4}}>{description}</p>}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                            <button style={{...styles.button, backgroundColor: '#f8f9fa', color: 'var(--text-color)', border: '1px solid var(--border-color)'}} onClick={onImport}>Import</button>
                            <button style={styles.button} onClick={onAdd}>Thêm mới</button>
                        </div>
                    </>
                )}
            </div>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={{...styles.th, width: '50px' }}>
                                <input type="checkbox" checked={isAllSelected} onChange={onSelectAll} disabled={data.length === 0} />
                            </th>
                            {columns.map(col => <th key={col.key} style={styles.th}>{col.header}</th>)}
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} style={{backgroundColor: selectedIds.has(item.id) ? 'var(--active-item-bg)' : 'transparent'}}>
                                <td style={styles.td}>
                                    <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => onSelectRow(item.id)} />
                                </td>
                                {columns.map(col => <td key={col.key} style={styles.td}>{col.render ? col.render(item) : item[col.key]}</td>)}
                                <td style={styles.td}>
                                    <button style={styles.actionButton}>Sửa</button>
                                    <button style={styles.actionButton} onClick={() => onDelete(item.id)}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const SubdivisionTab = ({ projectId }) => {
    const [subdivisions, setSubdivisions] = useState(mockSubdivisions.filter(s => s.projectId === projectId));
    const handleAdd = () => {
        const name = prompt("Nhập tên phân khu:");
        if (name) {
            setSubdivisions(prev => [...prev, { id: Date.now(), projectId, name }]);
        }
    };
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px' }}>Quản lý Phân khu</h3>
                <button style={styles.button} onClick={handleAdd}>Thêm mới</button>
            </div>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Tên Phân khu</th>
                            <th style={styles.th}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subdivisions.map(item => (
                            <tr key={item.id}>
                                <td style={styles.td}>{item.name}</td>
                                <td style={styles.td}>
                                    <button style={styles.actionButton}>Sửa</button>
                                    <button style={styles.actionButton}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const BlocksTab = ({ setView, blocks, onDelete, onBulkDelete, selectedIds, onSelectRow, onSelectAll, isAllSelected, onToggleVisibility }) => {
    const handleAdd = () => {
        setView('products.projects.detail.addBlock');
    };
    const handleImport = () => alert('Chức năng Import đang được phát triển.');

    const columns = [
        { key: 'name', header: 'Tên Khối' }, 
        { key: 'type', header: 'Loại hình' },
        { 
            key: 'visible', 
            header: 'Hiển thị', 
            render: (item) => (
                <ToggleSwitch 
                    checked={item.visible} 
                    onChange={() => onToggleVisibility(item.id)}
                />
            )
        }
    ];

    return <TabularDataManagement 
                title="Quản lý Khối Bất động sản"
                description="Khối (Tiểu khu) là một cụm công trình/sản phẩm cụ thể (như một tòa nhà chung cư, một khu biệt thự) nằm bên trong một Phân khu của dự án"
                columns={columns}
                data={blocks}
                onAdd={handleAdd}
                onImport={handleImport}
                onDelete={onDelete}
                onBulkDelete={onBulkDelete}
                selectedIds={selectedIds}
                onSelectRow={onSelectRow}
                onSelectAll={onSelectAll}
                isAllSelected={isAllSelected}
            />;
};

const FloorPlanTab = ({ projectId, plans, onAddFloorPlan, onDelete, onBulkDelete, selectedIds, onSelectRow, onSelectAll, isAllSelected }) => {
    const handleAdd = () => {
        // Simple prompt for example, a modal would be better
        const code = prompt("Nhập mã mặt bằng:");
        if (code) {
             onAddFloorPlan({ projectId, code, description: 'Mô tả mới', area: 0 });
        }
    };
     const handleImport = () => alert('Chức năng Import đang được phát triển.');

     return <TabularDataManagement 
                title="Quản lý Mặt bằng điển hình"
                // FIX: Added missing 'description' prop.
                description="Quản lý các loại hình mặt bằng căn hộ, biệt thự... điển hình có trong dự án."
                columns={[
                    { key: 'code', header: 'Mã' }, 
                    { key: 'description', header: 'Mô tả' },
                    { key: 'area', header: 'Diện tích (m²)' }
                ]}
                data={plans}
                onAdd={handleAdd}
                onImport={handleImport}
                onDelete={onDelete}
                onBulkDelete={onBulkDelete}
                selectedIds={selectedIds}
                onSelectRow={onSelectRow}
                onSelectAll={onSelectAll}
                isAllSelected={isAllSelected}
            />;
};

const AgencyTab = ({ projectId, allUsers }) => {
    const agencies = allUsers.filter(u => u.role === 'Đại lý');
    const [assignedAgencyIds, setAssignedAgencyIds] = useState(
        new Set(mockProjectAgencies.filter(pa => pa.projectId === projectId).map(pa => pa.agencyId))
    );

    const handleToggleAgency = (agencyId) => {
        setAssignedAgencyIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(agencyId)) {
                newSet.delete(agencyId);
            } else {
                newSet.add(agencyId);
            }
            return newSet;
        });
    };
    
    return (
        <div>
             <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>Quản lý Đại lý</h3>
             <div style={{...styles.card, padding: 0}}>
                 {agencies.map((agency, index) => (
                     <div key={agency.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: index < agencies.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                         <input 
                             type="checkbox" 
                             style={{ width: '18px', height: '18px', marginRight: '15px'}}
                             checked={assignedAgencyIds.has(agency.id)}
                             onChange={() => handleToggleAgency(agency.id)}
                         />
                         <div>
                             <div style={{ fontWeight: 600 }}>{agency.name}</div>
                             <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{agency.email}</div>
                         </div>
                     </div>
                 ))}
             </div>
              <div style={styles.formFooter}>
                <button style={styles.button}>Lưu thay đổi</button>
            </div>
        </div>
    );
};


const ProjectDetailView = ({ project, setView, users, blocks, floorPlans, onDeleteBlock, onBulkDeleteBlocks, selectedBlockIds, setSelectedBlockIds, onAddFloorPlan, onDeleteFloorPlan, onBulkDeleteFloorPlans, selectedFloorPlanIds, setSelectedFloorPlanIds, onToggleBlockVisibility }) => {
    const [activeTab, setActiveTab] = useState('overview');
    
    const projectBlocks = blocks.filter(b => b.projectId === project.id);
    const projectFloorPlans = floorPlans.filter(p => p.projectId === project.id);

    // --- SELECTION LOGIC ---
    const handleSelectBlock = (id) => {
        setSelectedBlockIds(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(id)) newSelection.delete(id);
            else newSelection.add(id);
            return newSelection;
        });
    };
    const handleSelectAllBlocks = (e) => {
        if (e.target.checked) setSelectedBlockIds(new Set(projectBlocks.map(i => i.id)));
        else setSelectedBlockIds(new Set());
    };
    const isAllBlocksSelected = projectBlocks.length > 0 && selectedBlockIds.size === projectBlocks.length;

    const handleSelectFloorPlan = (id) => {
        setSelectedFloorPlanIds(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(id)) newSelection.delete(id);
            else newSelection.add(id);
            return newSelection;
        });
    };
    const handleSelectAllFloorPlans = (e) => {
        if (e.target.checked) setSelectedFloorPlanIds(new Set(projectFloorPlans.map(i => i.id)));
        else setSelectedFloorPlanIds(new Set());
    };
    const isAllFloorPlansSelected = projectFloorPlans.length > 0 && selectedFloorPlanIds.size === projectFloorPlans.length;
    // --- END SELECTION LOGIC ---


    const tabs = [
        { id: 'overview', label: 'Tổng quan' },
        { id: 'subdivision', label: 'Phân khu' },
        { id: 'blocks', label: 'Khối bất động sản' },
        { id: 'floorplan', label: 'Mặt bằng điển hình' },
        { id: 'agency', label: 'Đại lý' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'subdivision': return <SubdivisionTab projectId={project.id} />;
            case 'blocks': return <BlocksTab 
                                    setView={setView} 
                                    blocks={projectBlocks}
                                    onDelete={onDeleteBlock}
                                    onBulkDelete={onBulkDeleteBlocks}
                                    selectedIds={selectedBlockIds}
                                    onSelectRow={handleSelectBlock}
                                    onSelectAll={handleSelectAllBlocks}
                                    isAllSelected={isAllBlocksSelected}
                                    onToggleVisibility={onToggleBlockVisibility}
                                />;
            case 'floorplan': return <FloorPlanTab 
                                        projectId={project.id} 
                                        plans={projectFloorPlans} 
                                        onAddFloorPlan={onAddFloorPlan}
                                        onDelete={onDeleteFloorPlan}
                                        onBulkDelete={onBulkDeleteFloorPlans}
                                        selectedIds={selectedFloorPlanIds}
                                        onSelectRow={handleSelectFloorPlan}
                                        onSelectAll={handleSelectAllFloorPlans}
                                        isAllSelected={isAllFloorPlansSelected}
                                    />;
            case 'agency': return <AgencyTab projectId={project.id} allUsers={users} />;
            case 'overview':
            default:
                return <OverviewTab project={project} />;
        }
    };
    
    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setView('products.projects')} style={{...styles.actionButton, border: 'none', padding: '5px 0', marginBottom: '10px'}}>
                    &larr; Quay lại danh sách dự án
                </button>
                <h2 style={{...styles.header, marginBottom: 0 }}>{project.name}</h2>
            </div>
            <div style={styles.tabContainer}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        style={{ ...styles.tabButton, ...(activeTab === tab.id ? styles.activeTabButton : {}) }}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div style={styles.tabContent}>
                {renderTabContent()}
            </div>
        </div>
    );
};


const RetailPropertyView = () => (
    <div>
        <h2 style={styles.header}>Quản lý Bất động sản lẻ</h2>
        <div style={styles.toolbar}>
            <button style={styles.button}>Thêm BĐS</button>
        </div>
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Tên BĐS</th>
                        <th style={styles.th}>Địa chỉ</th>
                        <th style={styles.th}>Giá</th>
                        <th style={styles.th}>Loại hình</th>
                        <th style={styles.th}>Trạng thái</th>
                        <th style={styles.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {mockRetailProperties.map(prop => (
                        <tr key={prop.id}>
                            <td style={styles.td}>{prop.id}</td>
                            <td style={styles.td}>{prop.name}</td>
                            <td style={styles.td}>{prop.address}</td>
                            <td style={styles.td}>{prop.price}</td>
                            <td style={styles.td}>{prop.type}</td>
                            <td style={styles.td}>{prop.status}</td>
                            <td style={styles.td}>
                                <button style={styles.actionButton}>Sửa</button>
                                <button style={styles.actionButton}>Xoá</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const DiscountManagementView = () => (
    <div>
        <h2 style={styles.header}>Quản lý mã giảm giá</h2>
        <div style={styles.toolbar}>
            <button style={styles.button}>Tạo mã mới</button>
        </div>
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Mã</th>
                        <th style={styles.th}>Mô tả</th>
                        <th style={styles.th}>Giảm giá</th>
                        <th style={styles.th}>Ngày hết hạn</th>
                        <th style={styles.th}>Trạng thái</th>
                        <th style={styles.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {mockDiscounts.map(discount => (
                        <tr key={discount.id}>
                            <td style={styles.td}>{discount.code}</td>
                            <td style={styles.td}>{discount.description}</td>
                            <td style={styles.td}>{discount.discount}</td>
                            <td style={styles.td}>{discount.expiry}</td>
                            <td style={styles.td}>{discount.status}</td>
                            <td style={styles.td}>
                                <button style={styles.actionButton}>Sửa</button>
                                <button style={styles.actionButton}>Xoá</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const LivestreamView = () => (
    <div>
        <h2 style={styles.header}>Quản lý Livestream</h2>
        <div style={styles.toolbar}>
            <button style={styles.button}>Tạo livestream mới</button>
        </div>
        <div style={{ ...styles.card, marginBottom: '20px' }}>
            <h3 style={styles.cardTitle}>
                Livestream hiện tại
                <span style={styles.liveBadge}>LIVE</span>
            </h3>
            <p style={{ fontSize: '20px', fontWeight: 600, margin: '10px 0' }}>Mở bán dự án The 9 Stellars</p>
            <p style={{ color: 'var(--text-secondary)' }}>Đang xem: 1,288</p>
        </div>
        <div style={styles.card}>
            <h3 style={styles.cardTitle}>Livestream đã lên lịch</h3>
            <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                        <p style={{ fontWeight: 500 }}>Giới thiệu dự án Masteri</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>10:00 - 25/12/2024</p>
                    </div>
                    <button style={styles.button}>Bắt đầu</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                    <div>
                        <p style={{ fontWeight: 500 }}>Hỏi đáp cùng chuyên gia</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>14:00 - 30/12/2024</p>
                    </div>
                    <button style={styles.button}>Bắt đầu</button>
                </div>
            </div>
        </div>
    </div>
);

const InboxView = () => {
    const [selectedConversationId, setSelectedConversationId] = useState(1);
    const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);
    const messages = mockMessages[selectedConversationId] || [];

    return (
        <>
            <h2 style={styles.header}>Inbox</h2>
            <div style={styles.inboxContainer}>
                <div style={styles.conversationList}>
                    {mockConversations.map(convo => (
                        <div
                            key={convo.id}
                            style={{ ...styles.conversationItem, backgroundColor: selectedConversationId === convo.id ? 'var(--active-item-bg)' : 'transparent' }}
                            onClick={() => setSelectedConversationId(convo.id)}
                        >
                            <div style={styles.avatar}>{convo.avatar}</div>
                            <div style={styles.conversationDetails}>
                                <p style={styles.customerName}>{convo.customerName}</p>
                                <p style={styles.lastMessage}>{convo.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={styles.chatWindow}>
                    {selectedConversation ? (
                        <>
                            <div style={styles.chatHeader}>{selectedConversation.customerName}</div>
                            <div style={styles.messageList}>
                                {messages.map(msg => (
                                    <div key={msg.id} style={{ ...styles.messageBubble, ...(msg.sender === 'admin' ? styles.adminMessage : styles.customerMessage) }}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                            <div style={styles.messageInputContainer}>
                                <input type="text" placeholder="Nhập tin nhắn..." style={styles.messageInput} />
                                <button style={styles.sendButton}>Gửi</button>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            Chọn một cuộc trò chuyện để bắt đầu
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};


const App = () => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [projects, setProjects] = useState(mockProjects);
    const [blocks, setBlocks] = useState(mockBlocks);
    const [floorPlans, setFloorPlans] = useState(mockFloorPlans);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedBlockIds, setSelectedBlockIds] = useState(new Set());
    const [selectedFloorPlanIds, setSelectedFloorPlanIds] = useState(new Set());


    const handleAddProject = (newProject) => {
        setProjects(prev => [{ ...newProject, id: Date.now() }, ...prev]);
        setActiveView('products.projects');
    };

    const handleAddBlock = (newBlock) => {
        setBlocks(prev => [{ ...newBlock, id: Date.now() }, ...prev]);
        setActiveView('products.projects.detail');
    };
    
    const handleAddFloorPlan = (newPlan) => {
        setFloorPlans(prev => [...prev, { ...newPlan, id: Date.now() }]);
    };

    const handleProjectVisibilityToggle = (projectId: number) => {
        setProjects(prevProjects =>
            prevProjects.map(p =>
                p.id === projectId ? { ...p, visible: !p.visible } : p
            )
        );
    };

    const handleEditProject = (project) => {
        setSelectedProject(project);
        setSelectedBlockIds(new Set());
        setSelectedFloorPlanIds(new Set());
        setActiveView('products.projects.detail');
    };

    const handleDeleteBlock = (id) => setBlocks(prev => prev.filter(item => item.id !== id));
    const handleBulkDeleteBlocks = () => {
        setBlocks(prev => prev.filter(item => !selectedBlockIds.has(item.id)));
        setSelectedBlockIds(new Set());
    };

    const handleToggleBlockVisibility = (blockId: number) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(b =>
                b.id === blockId ? { ...b, visible: !b.visible } : b
            )
        );
    };

    const handleDeleteFloorPlan = (id) => setFloorPlans(prev => prev.filter(item => item.id !== id));
    const handleBulkDeleteFloorPlans = () => {
        setFloorPlans(prev => prev.filter(item => !selectedFloorPlanIds.has(item.id)));
        setSelectedFloorPlanIds(new Set());
    };

    const renderView = () => {
        switch (activeView) {
            case 'users':
                return <UserManagementView />;
            case 'products.projects':
                return <ProjectManagementView projects={projects} setView={setActiveView} onToggleVisibility={handleProjectVisibilityToggle} onEditProject={handleEditProject} />;
            case 'products.projects.add':
                return <AddProjectView onAddProject={handleAddProject} setView={setActiveView} />;
            case 'products.projects.detail':
                 return <ProjectDetailView 
                            project={selectedProject} 
                            setView={setActiveView} 
                            users={mockUsers} 
                            blocks={blocks} 
                            floorPlans={floorPlans}
                            onDeleteBlock={handleDeleteBlock}
                            onBulkDeleteBlocks={handleBulkDeleteBlocks}
                            selectedBlockIds={selectedBlockIds}
                            setSelectedBlockIds={setSelectedBlockIds}
                            onAddFloorPlan={handleAddFloorPlan}
                            onDeleteFloorPlan={handleDeleteFloorPlan}
                            onBulkDeleteFloorPlans={handleBulkDeleteFloorPlans}
                            selectedFloorPlanIds={selectedFloorPlanIds}
                            setSelectedFloorPlanIds={setSelectedFloorPlanIds}
                            onToggleBlockVisibility={handleToggleBlockVisibility}
                         />;
            case 'products.projects.detail.addBlock':
                 return <AddBlockView project={selectedProject} setView={setActiveView} onAddBlock={handleAddBlock} />;
            case 'products.retail':
                return <RetailPropertyView />;
            case 'discounts':
                return <DiscountManagementView />;
            case 'livestream':
                return <LivestreamView />;
            case 'inbox':
                return <InboxView />;
            case 'dashboard':
            default:
                return <DashboardView />;
        }
    };

    return (
        <div style={styles.appContainer}>
            <Sidebar
              activeView={activeView}
              setView={setActiveView}
              isCollapsed={isSidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
            />
            <main style={styles.mainContent}>
                {renderView()}
            </main>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);