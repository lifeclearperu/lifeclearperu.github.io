import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Layout, Card, Form, Input, Button, Typography, message, Space, Menu, Row, Col, Table, Modal, Popconfirm, Select, Result, Spin, List, Divider } from 'antd';
import { ScanOutlined, TeamOutlined, MailOutlined, UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, CameraOutlined, ExperimentOutlined, CheckCircleOutlined, AppleFilled, GoogleOutlined } from '@ant-design/icons';
// NOTA: La librería de escaneo se carga dinámicamente para evitar problemas de compilación.

// --- Configuración de Axios ---
// CORRECCIÓN: Se define la IP del servidor directamente para evitar el error de compilación con 'import.meta.env'.
// Asegúrate de que esta es la IP pública correcta de tu servidor DigitalOcean.
const API_BASE_URL = 'http://157.230.173.231'; 

// --- Componentes de Ant Design ---
const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Meta } = Card;

// --- Constantes y Estilos ---
const colors = {
  primary: '#007bff', success: '#28a745', accent: '#fd7e14', 
  white: '#ffffff', lightBg: '#f0f2f5', text: '#333', darkText: '#1d3557',
  evaluation: {
    Excelente: '#28a745', Bueno: '#90ee90', Mediocre: '#fd7e14', Malo: '#dc3545'
  }
};

const globalStyles = `
  html, body, #root { margin: 0; padding: 0; width: 100%; overflow-x: hidden; scroll-behavior: smooth; font-family: 'Inter', sans-serif; }
  .section { padding: 100px 40px; }
  .section-content { max-width: 1200px; margin: 0 auto; width: 100%; }
  .hero-section { background-color: ${colors.white}; display: flex; align-items: center; min-height: 90vh; }
  .features-section { background-color: ${colors.lightBg}; }
  .nosotros-section { background-color: ${colors.white}; }
  .download-section { background: linear-gradient(45deg, ${colors.primary}, ${colors.success}); color: ${colors.white}; text-align: center; }
  .contacto-section { background-color: ${colors.lightBg}; }
  .feature-card { text-align: center; padding: 24px; background: ${colors.white}; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
  .hero-image {
    max-width: 100%;
    max-height: 550px; /* <-- CORRECCIÓN: Se limita la altura máxima de la imagen */
    height: auto;
    object-fit: contain; /* Se asegura que la imagen se vea completa sin distorsión */
    border-radius: 20px;
  }
`;

const layoutStyle = { minHeight: '100vh', backgroundColor: colors.lightBg };
const cardStyle = { maxWidth: '450px', width: '100%', padding: '30px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '12px', textAlign: 'center' };

// --- Componente: LifeClearLogo ---
const LifeClearLogo = () => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <img 
            src="/logolifeclear.png" 
            alt="LifeClear Logo" 
            style={{ height: '40px', width: 'auto' }}
        />
    </div>
);


// --- Componente: LandingPage.jsx ---
const LandingPage = ({ setView }) => {
  return (
    <Layout style={{width: '100%'}}>
      <Header style={{ position: 'fixed', zIndex: 10, width: '100%', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 8px #f0f1f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LifeClearLogo />
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Menu theme="light" mode="horizontal" style={{ borderBottom: 'none', lineHeight: '62px', marginRight: '20px', background: 'transparent' }}><Menu.Item key="1"><a href="#inicio">Inicio</a></Menu.Item><Menu.Item key="2"><a href="#como-funciona">¿Cómo funciona?</a></Menu.Item><Menu.Item key="3"><a href="#nosotros">Nosotros</a></Menu.Item></Menu>
            <Button type="primary" onClick={() => setView('login')} style={{ backgroundColor: colors.accent, border: 'none' }}>Iniciar Sesión</Button>
        </div>
      </Header>
      <Content style={{ paddingTop: '64px' }}>
        <section id="inicio" className="section hero-section">
            <div className="section-content">
                <Row align="middle" gutter={[64, 32]}>
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size="large">
                            <Title style={{ marginBottom: 0, fontSize: '3.8rem', fontWeight: 'bold', color: colors.darkText, lineHeight: '1.2' }}>La claridad que mereces en cada compra.</Title>
                            <Paragraph style={{ fontSize: '18px', color: colors.text }}>Escanea productos, entiende sus ingredientes y toma decisiones más saludables para ti y tu familia con LifeClear.</Paragraph>
                            <Button type="primary" size="large" onClick={() => setView('login')} style={{ height: '50px', fontSize: '18px', padding: '0 30px', backgroundColor: colors.accent, border: 'none' }}>Empezar Ahora</Button>
                        </Space>
                    </Col>
                    <Col xs={24} md={12} style={{textAlign: 'center'}}>
                        <img src="https://yuka.io/wp-content/themes/fusion/images/v2/home/es/tel.png" alt="Persona usando la app LifeClear en un supermercado" className="hero-image" />
                    </Col>
                </Row>
            </div>
        </section>

        <section id="como-funciona" className="section features-section">
            <div className="section-content" style={{ textAlign: 'center' }}>
                <Title level={2} style={{color: colors.darkText, marginBottom: '16px'}}>Simple, Rápido y Transparente</Title>
                <Paragraph style={{fontSize: '18px', color: colors.text, maxWidth: '700px', margin: '0 auto 60px auto'}}>En solo tres pasos, transforma tu manera de comprar.</Paragraph>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={8}>
                        <div className="feature-card">
                            <CameraOutlined style={{fontSize: '48px', color: colors.primary, marginBottom: '20px'}}/>
                            <Title level={4}>1. Escanea</Title>
                            <Paragraph>Usa la cámara de tu teléfono para escanear el código de barras de cualquier alimento o cosmético.</Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                         <div className="feature-card">
                            <ExperimentOutlined style={{fontSize: '48px', color: colors.success, marginBottom: '20px'}}/>
                            <Title level={4}>2. Analiza</Title>
                            <Paragraph>Obtén al instante un análisis detallado de los ingredientes, aditivos y la puntuación de salud del producto.</Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={8}>
                         <div className="feature-card">
                            <CheckCircleOutlined style={{fontSize: '48px', color: colors.accent, marginBottom: '20px'}}/>
                            <Title level={4}>3. Decide</Title>
                            <Paragraph>Compara con alternativas más saludables y toma la mejor decisión para tu bienestar con información clara.</Paragraph>
                        </div>
                    </Col>
                </Row>
            </div>
        </section>

        <section id="nosotros" className="section nosotros-section">
            <div className="section-content">
                <Row align="middle" gutter={[64, 32]}>
                    <Col xs={24} md={12}><img src="/usuariorevisandoproducto.png" alt="Usuario de LifeClear revisando un producto" className="hero-image" /></Col>
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size="middle">
                            <Title level={2} style={{color: colors.darkText}}>Nuestra Misión es la Transparencia</Title>
                            <Paragraph style={{fontSize: '16px', color: colors.text}}>Creemos que todos tienen el derecho a saber qué hay dentro de los productos que consumen. LifeClear nació de la necesidad de tener información clara y accesible, sin términos complicados. Somos un equipo independiente comprometido con tu bienestar.</Paragraph>
                        </Space>
                    </Col>
                </Row>
            </div>
        </section>
        
        <section id="acceso" className="section download-section">
             <div className="section-content">
                 <Title style={{color: colors.white, marginBottom: '16px'}}>Accede desde cualquier dispositivo</Title>
                 <Paragraph style={{fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 40px auto'}}>LifeClear es una aplicación web. Úsala en tu teléfono, tablet o computadora sin necesidad de instalar nada.</Paragraph>
                 <Button 
                    type="primary" 
                    size="large" 
                    onClick={() => setView('login')} 
                    style={{height: '60px', padding: '0 30px', fontSize: '18px', background: colors.white, color: colors.primary, fontWeight: 'bold'}}
                 >
                    Crear Cuenta Gratis
                </Button>
             </div>
        </section>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#343a40', color: '#adb5bd' }}>
          <div className="section-content" style={{padding: '40px 20px'}}>
               <Row justify="space-between" align="top">
                   <Col xs={24} sm={12} style={{textAlign: 'left', marginBottom: '20px'}}>
                       <Title level={4} style={{color: 'white'}}>LifeClear</Title>
                       <Text style={{color: '#adb5bd'}}>Compras inteligentes, vida saludable.</Text>
                   </Col>
                   <Col xs={24} sm={12} style={{textAlign: 'right'}}>
                       <a href="#inicio" style={{color: 'white', margin: '0 10px'}}>Inicio</a>
                       <a href="#nosotros" style={{color: 'white', margin: '0 10px'}}>Nosotros</a>
                   </Col>
               </Row>
                <Divider style={{borderColor: 'rgba(255,255,255,0.1)'}}/>
                <Text style={{color: '#6c757d'}}>LifeClear ©2025 - Todos los derechos reservados.</Text>
          </div>
      </Footer>
    </Layout>
  );
};

// --- Componente: LoginPage.jsx ---
const LoginPage = ({ handleLogin, setView, loading, error }) => (
    <Layout style={{width: '100%'}}>
        <Header style={{ background: 'white', boxShadow: '0 2px 8px #f0f1f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <LifeClearLogo />
            <Button type="link" onClick={() => setView('landing')}>Volver al Inicio</Button>
        </Header>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 20px' }}>
            <Card style={cardStyle}>
                <Title level={2} style={{ marginBottom: '10px' }}>Iniciar Sesión</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '30px' }}>Ingresa tus credenciales</Text>
                <Form name="login" onFinish={handleLogin} layout="vertical" requiredMark={false}>
                    <Form.Item name="email" rules={[{ required: true, message: 'Correo requerido.' }, { type: 'email', message: 'Correo no válido.' }]}><Input placeholder="Correo electrónico" size="large" /></Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Contraseña requerida.' }]}><Input.Password placeholder="Contraseña" size="large" /></Form.Item>
                    {error && <Text type="danger" style={{ display: 'block', marginBottom: '15px' }}>{error}</Text>}
                    <Form.Item><Button type="primary" htmlType="submit" block size="large" loading={loading} style={{backgroundColor: colors.primary}}>Ingresar</Button></Form.Item>
                </Form>
                <Space>
                    <Text>¿No tienes cuenta?</Text>
                    <Button type="link" onClick={() => setView('register')}>Regístrate aquí</Button>
                </Space>
            </Card>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#343a40', color: '#adb5bd' }}>
            <div className="section-content" style={{padding: '40px 20px'}}>
                <Text style={{color: '#6c757d'}}>LifeClear ©2025 - Todos los derechos reservados.</Text>
            </div>
        </Footer>
    </Layout>
);

// --- Componente: RegisterPage.jsx ---
const RegisterPage = ({ handleRegister, setView, loading }) => (
    <Layout style={{width: '100%'}}>
        <Header style={{ background: 'white', boxShadow: '0 2px 8px #f0f1f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <LifeClearLogo />
            <Button type="link" onClick={() => setView('landing')}>Volver al Inicio</Button>
        </Header>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '50px 20px' }}>
            <Card style={cardStyle}>
                <Title level={2} style={{ marginBottom: '10px' }}>Crear Cuenta</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '30px' }}>Completa tus datos</Text>
                <Form name="register" onFinish={handleRegister} layout="vertical" requiredMark={false}>
                    <Form.Item name="nombre" rules={[{ required: true, message: 'Nombre requerido.' }]}><Input prefix={<UserOutlined />} placeholder="Nombre completo" size="large" /></Form.Item>
                    <Form.Item name="email" rules={[{ required: true, message: 'Correo requerido.' }, { type: 'email', message: 'Correo no válido.' }]}><Input placeholder="Correo electrónico" size="large" /></Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'Contraseña requerida.' }]}><Input.Password placeholder="Contraseña" size="large" /></Form.Item>
                    <Form.Item><Button type="primary" htmlType="submit" block size="large" loading={loading} style={{backgroundColor: colors.primary}}>Registrarse</Button></Form.Item>
                </Form>
                <Space>
                    <Text>¿Ya tienes cuenta?</Text>
                    <Button type="link" onClick={() => setView('login')}>Inicia sesión</Button>
                </Space>
            </Card>
        </Content>
         <Footer style={{ textAlign: 'center', background: '#343a40', color: '#adb5bd' }}>
            <div className="section-content" style={{padding: '40px 20px'}}>
                <Text style={{color: '#6c757d'}}>LifeClear ©2025 - Todos los derechos reservados.</Text>
            </div>
        </Footer>
    </Layout>
);

// --- Componente: Dashboard.jsx ---
const Dashboard = ({ usuario, handleLogout, token }) => {
    const [dashboardView, setDashboardView] = useState('idle'); // idle, scanning, result, loading
    const [productResult, setProductResult] = useState(null);
    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);

    const handleApiCall = useCallback(async (barcode) => {
        setDashboardView('loading');
        try {
            // Utiliza la URL base de la variable de entorno
            const response = await axios.get(`${API_BASE_URL}/productos/${barcode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProductResult({ data: response.data, error: null });
        } catch (error) {
            setProductResult({ data: null, error: 'Producto no encontrado en nuestra base de datos.' });
        } finally {
            setDashboardView('result');
        }
    }, [token]);

    const stopScan = useCallback(() => {
        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
            codeReaderRef.current = null;
        }
    }, []);

    const handleManualSearch = ({ barcode }) => {
        if (barcode && barcode.trim()) {
            handleApiCall(barcode.trim());
        } else {
            message.error('Por favor, ingresa un código de barras.');
        }
    };

    useEffect(() => {
        const startScan = async () => {
            if (dashboardView === 'scanning' && !codeReaderRef.current) {
                try {
                    const hints = new Map();
                    const formats = Object.values(window.ZXing.BarcodeFormat);
                    hints.set(window.ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);

                    const codeReader = new window.ZXing.BrowserMultiFormatReader(hints);
                    codeReaderRef.current = codeReader;
                    
                    if (videoRef.current) {
                        await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
                            if (result) {
                                console.log(`Código detectado: ${result.text}, Formato: ${result.getBarcodeFormat()}`);
                                message.success(`Código detectado: ${result.text}`);
                                stopScan();
                                handleApiCall(result.text);
                            }
                            if (err && !(err instanceof window.ZXing.NotFoundException)) {
                                console.error('Error de escaneo:', err);
                            }
                        });
                    }
                } catch (err) {
                    console.error("Error al iniciar el escáner:", err);
                    if (err.name === 'NotAllowedError') {
                        message.error("Se necesita permiso para acceder a la cámara.");
                    } else {
                        message.error("No se pudo iniciar la cámara.");
                    }
                    setDashboardView('idle');
                }
            }
        };

        const scriptId = 'zxing-script';
        if (dashboardView === 'scanning') {
            if (window.ZXing) {
                startScan();
            } else if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = "https://unpkg.com/@zxing/library@latest/umd/index.min.js";
                script.async = true;
                script.onload = startScan;
                document.body.appendChild(script);
            }
        }

        return () => {
            stopScan();
        };
    }, [dashboardView, handleApiCall, stopScan]);

    const renderDashboardContent = () => {
        switch (dashboardView) {
            case 'scanning':
                return (
                    <div style={{width: '100%', maxWidth: '500px', textAlign: 'center'}}>
                        <Title level={4}>Apunta la cámara al código de barras</Title>
                        <div className="scanner-container">
                            <video ref={videoRef} style={{ width: '100%', height: 'auto' }} playsInline />
                        </div>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => setDashboardView('idle')} 
                            style={{marginTop: '20px', backgroundColor: colors.accent, color: colors.white, border: 'none'}}
                        >
                            Volver
                        </Button>
                    </div>
                );
            case 'loading':
                return <Spin tip="Buscando producto..." size="large" />;
            case 'result':
                return (
                    <div style={{width: '100%', maxWidth: '500px'}}>
                    {productResult.error ? (
                        <Result
                            status="warning"
                            title={productResult.error}
                            extra={<Button onClick={() => setDashboardView('idle')}>Volver</Button>}
                        />
                    ) : (
                        <Card
                            style={{width: '100%', textAlign: 'left', border: `2px solid ${colors.evaluation[productResult.data.evaluacion] || '#e8e8e8'}`}}
                            cover={<img alt={productResult.data.nombre} src={productResult.data.imagen_url || 'https://placehold.co/400x300/e2e8f0/64748b?text=Sin+Imagen'} style={{ maxHeight: '250px', objectFit: 'contain', padding: '10px' }} />}
                            bodyStyle={{ paddingTop: '12px' }}
                        >
                            <Title level={3} style={{ marginBottom: 0 }}>{productResult.data.nombre}</Title>
                            <Text type="secondary" style={{ display: 'block' }}>{productResult.data.marca} - {productResult.data.codigo_barras}</Text>
                            <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
                            <Row gutter={16} align="middle" style={{ textAlign: 'center' }}><Col span={12}><Title level={5} type="secondary">Evaluación</Title><Text style={{ backgroundColor: colors.evaluation[productResult.data.evaluacion], color: ['Excelente', 'Malo'].includes(productResult.data.evaluacion) ? 'white' : 'black', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.2rem' }}>{productResult.data.evaluacion}</Text></Col><Col span={12}><Title level={5} type="secondary">Puntuación</Title><Title level={2} style={{ margin: 0, color: colors.primary }}>{productResult.data.puntuacion}<span style={{fontSize: '1rem'}}>/100</span></Title></Col></Row>
                            {productResult.data.observaciones && (<><Divider style={{ marginTop: '16px', marginBottom: '16px' }} /><Title level={5}>Observaciones</Title><Paragraph type="secondary">{productResult.data.observaciones}</Paragraph></>)}
                            <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
                            <Title level={5}>Ingredientes</Title>
                            <Paragraph type="secondary">{productResult.data.ingredientes && productResult.data.ingredientes.length > 0 ? productResult.data.ingredientes.join(', ') : 'No especificados.'}</Paragraph>
                            <Space style={{marginTop: '20px', width: '100%'}}><Button type="primary" onClick={() => setDashboardView('scanning')}>Escanear Otro</Button><Button onClick={() => setDashboardView('idle')}>Volver</Button></Space>
                        </Card>
                    )}
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div style={{textAlign: 'center', width: '100%'}}>
                        <Card style={{ marginBottom: '20px', border: `2px solid ${colors.primary}`}}>
                            <Space direction="vertical" size="large">
                                <ScanOutlined style={{ fontSize: '60px', color: colors.primary }} />
                                <Title level={3}>Escanear Producto</Title>
                                <Paragraph type="secondary">Usa la cámara de tu dispositivo para analizar un código de barras al instante.</Paragraph>
                                <Button onClick={() => setDashboardView('scanning')} type="primary" size="large" icon={<ScanOutlined />}>Iniciar Escáner</Button>
                            </Space>
                        </Card>
                         <Divider plain>o</Divider>
                         <Form onFinish={handleManualSearch} style={{width: '100%'}}>
                            <Space.Compact style={{ width: '100%' }}>
                                <Form.Item name="barcode" noStyle rules={[{ required: true, message: '' }]}>
                                    <Input placeholder="Ingresa código de barras del producto." size="large"/>
                                </Form.Item>
                                <Button type="default" htmlType="submit" size="large">Buscar</Button>
                            </Space.Compact>
                        </Form>
                    </div>
                );
        }
    };

    return (
        <Layout style={layoutStyle}>
            <Header style={{ background: colors.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', boxShadow: '0 2px 8px #f0f1f2' }}>
                <LifeClearLogo />
                <Space>
                    <Text>¡Hola, {usuario?.nombre}!</Text>
                    <Button type="default" onClick={handleLogout}>Cerrar Sesión</Button>
                </Space>
            </Header>
            <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {dashboardView === 'idle' ? 
                    <div style={{width: '100%', maxWidth: '500px'}}>{renderDashboardContent()}</div> :
                    renderDashboardContent()
                }
            </Content>
             <Footer style={{ textAlign: 'center', background: '#f0f2f5', borderTop: '1px solid #e9ecef' }}>
                LifeClear ©2025 - Todos los derechos reservados.
            </Footer>
        </Layout>
    );
};


// --- Componente: AdminDashboard.jsx ---
const AdminDashboard = ({ usuario, handleLogout, token }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [modalError, setModalError] = useState('');
    const [form] = Form.useForm();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            // Utiliza la URL base
            const response = await axios.get(`${API_BASE_URL}/admin/productos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(response.data);
        } catch (error) {
            message.error('Error al cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchProducts();
        }
    }, [token, fetchProducts]);

    const handleDelete = async (codigo_barras) => {
        try {
            // Utiliza la URL base
            await axios.delete(`${API_BASE_URL}/admin/productos/${codigo_barras}`, { headers: { Authorization: `Bearer ${token}` } });
            message.success('Producto eliminado correctamente.');
            fetchProducts();
        } catch (error) {
            message.error('Error al eliminar el producto.');
        }
    };
    
    const handleFormSubmit = async (values) => {
        setModalError('');
        const method = editingProduct ? 'put' : 'post';
        // Utiliza la URL base
        const url = editingProduct 
            ? `${API_BASE_URL}/admin/productos/${editingProduct.codigo_barras_original}`
            : `${API_BASE_URL}/admin/productos`;
        
        try {
            await axios[method](url, values, { headers: { Authorization: `Bearer ${token}` } });
            message.success(`Producto ${editingProduct ? 'actualizado' : 'creado'} correctamente.`);
            setIsModalVisible(false);
            fetchProducts();
        } catch (error) {
            setModalError(error.response?.data?.message || 'Ocurrió un error.');
        }
    };
    
    const closeModal = () => {
        setIsModalVisible(false);
        setEditingProduct(null);
        setModalError('');
        form.resetFields();
    };

    const openModal = (product = null) => {
        setModalError('');
        if (product) {
            setEditingProduct({ ...product, codigo_barras_original: product.codigo_barras });
            form.setFieldsValue(product);
        } else {
            setEditingProduct(null);
            form.resetFields();
            form.setFieldsValue({ tipo_producto: 'alimento', evaluacion: 'Bueno', autenticidad: 'no registrado' });
        }
        setIsModalVisible(true);
    };

    return (
        <Layout><Header style={{ background: colors.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><LifeClearLogo /><Space><Text>Admin: {usuario?.nombre}</Text><Button onClick={handleLogout}>Cerrar Sesión</Button></Space></Header>
        <Content style={{ padding: '20px 50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Title level={3}>Gestión de Productos</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Añadir Producto</Button>
            </div>
            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
                dataSource={products}
                loading={loading}
                renderItem={(product) => (
                    <List.Item>
                        <Card
                            hoverable
                            cover={<img alt={product.nombre} src={product.imagen_url || 'https://placehold.co/300x200/e2e8f0/64748b?text=Sin+Imagen'} style={{height: 220, objectFit: 'cover'}} />}
                            actions={[
                                <EditOutlined key="edit" onClick={() => openModal(product)} />,
                                <Popconfirm title="¿Estás seguro?" onConfirm={() => handleDelete(product.codigo_barras)} okText="Sí" cancelText="No">
                                    <DeleteOutlined key="delete" style={{color: 'red'}} />
                                </Popconfirm>
                            ]}
                        >
                            <Meta
                                title={product.nombre}
                                description={product.marca}
                            />
                             <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <Text style={{
                                    backgroundColor: colors.evaluation[product.evaluacion] || colors.lightBg,
                                    color: ['Excelente', 'Malo'].includes(product.evaluacion) ? 'white' : 'black',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    fontSize: '12px'
                                }}>
                                    {product.evaluacion}
                                </Text>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </Content>
        <Modal title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'} open={isModalVisible} onCancel={closeModal} footer={null} maskClosable={false}>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}><Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="codigo_barras" label="Código de Barras" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="marca" label="Marca"><Input /></Form.Item><Form.Item name="imagen_url" label="Link de Imagen"><Input placeholder="https://ejemplo.com/imagen.jpg" /></Form.Item><Form.Item name="ingredientes" label="Ingredientes"><Select mode="tags" style={{ width: '100%' }} placeholder="Añade ingredientes y presiona Enter" /></Form.Item><Form.Item name="observaciones" label="Observaciones"><Input.TextArea rows={3} /></Form.Item><Form.Item name="tipo_producto" label="Tipo" rules={[{ required: true }]}><Select><Option value="alimento">Alimento</Option><Option value="cosmetico">Cosmético</Option></Select></Form.Item><Form.Item name="evaluacion" label="Evaluación" rules={[{ required: true }]}><Select><Option value="Excelente">Excelente</Option><Option value="Bueno">Bueno</Option><Option value="Mediocre">Mediocre</Option><Option value="Malo">Malo</Option></Select></Form.Item><Form.Item name="autenticidad" label="Autenticidad" rules={[{ required: true }]}><Select><Option value="original">Original</Option><Option value="no registrado">No Registrado</Option></Select></Form.Item><Form.Item name="puntuacion" label="Puntuación"><Input type="number" /></Form.Item>{modalError && <Text type="danger" style={{ display: 'block', marginBottom: '15px' }}>{modalError}</Text>}<Form.Item><Button type="primary" htmlType="submit">Guardar</Button></Form.Item></Form>
        </Modal>
        <Footer style={{ textAlign: 'center', background: '#f0f2f5', borderTop: '1px solid #e9ecef' }}>
            LifeClear ©2025 - Todos los derechos reservados.
        </Footer>
        </Layout>
    );
};

// --- Componente Principal: App.jsx ---
function App() {
  const [view, setView] = useState('landing');
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); 
    const storedUser = localStorage.getItem('usuario');
    if (storedToken && storedUser) { 
        const userData = JSON.parse(storedUser);
        setToken(storedToken); 
        setUsuario(userData); 
        setView(userData.isAdmin ? 'adminDashboard' : 'dashboard');
    }
  }, []);

  const handleLogin = async (values) => {
    setLoading(true);
    setLoginError('');
    try {
      // Utiliza la URL base
      const response = await axios.post(`${API_BASE_URL}/admin/login`, values);
      const { token: newToken, usuario: userData } = response.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('usuario', JSON.stringify(userData));
      setToken(newToken);
      setUsuario(userData);
      setView('adminDashboard');
      message.success(`¡Bienvenido Admin, ${userData.nombre}!`);
    } catch (adminError) {
      if (adminError.response && (adminError.response.status === 401 || adminError.response.status === 403)) {
        try {
          // Utiliza la URL base
          const userResponse = await axios.post(`${API_BASE_URL}/usuarios/login`, values);
          const { token: newToken, usuario: userData } = userResponse.data;
          const finalUserData = { ...userData, isAdmin: false };
          localStorage.setItem('token', newToken);
          localStorage.setItem('usuario', JSON.stringify(finalUserData));
          setToken(newToken);
          setUsuario(finalUserData);
          setView('dashboard');
          message.success(`¡Bienvenido, ${userData.nombre}!`);
        } catch (userError) {
          const errorMessage = userError.response?.data?.message || 'Credenciales inválidas.';
          setLoginError(errorMessage);
        }
      } else {
         const errorMessage = adminError.response?.data?.message || 'Ocurrió un error en el servidor.';
         setLoginError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
      setLoading(true);
      try {
          // Utiliza la URL base
          const response = await axios.post(`${API_BASE_URL}/usuarios/registro`, values);
          const { token: newToken, usuario: userData } = response.data;
          localStorage.setItem('token', newToken); 
          localStorage.setItem('usuario', JSON.stringify(userData));
          setToken(newToken); 
          setUsuario(userData); 
          setView('dashboard');
          message.success(`Registro exitoso. ¡Bienvenido, ${userData.nombre}!`);
      } catch (err) {
          message.error(err.response?.data?.message || 'Error en el registro.');
      } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario');
    setToken(null); 
    setUsuario(null); 
    setView('landing');
    setLoginError('');
    message.info('Has cerrado la sesión.');
  };
  
  const renderCurrentView = () => {
    switch (view) {
      case 'adminDashboard': return <AdminDashboard usuario={usuario} handleLogout={handleLogout} token={token} />;
      case 'dashboard': return <Dashboard usuario={usuario} handleLogout={handleLogout} token={token} />;
      case 'login': return <LoginPage handleLogin={handleLogin} setView={setView} loading={loading} error={loginError} />;
      case 'register': return <RegisterPage handleRegister={handleRegister} setView={setView} loading={loading} />;
      default: return <LandingPage setView={(newView) => { setLoginError(''); setView(newView); }} />;
    }
  };

  return (<><style>{globalStyles}</style>{renderCurrentView()}</>);
}

export default App;

