const dialectNames = {
    cantonese: '粤语（广东话）',
    minnan: '闽南语（福建话）',
    shanghainese: '上海话',
    sichuan: '四川话',
    hakka: '客家话',
    northeastern: '东北话',
    beijing: '北京话',
    tianjin: '天津话',
    suo: '粤语口语/俗语'
};

const USERS_KEY = 'dialect_translator_users';
const SESSION_KEY = 'dialect_translator_session';

// ===== 用户认证相关 =====

// 获取所有用户
function getUsers() {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
}

// 保存用户
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// 获取当前登录用户
function getCurrentUser() {
    const session = localStorage.getItem(SESSION_KEY);
    return session || null;
}

// 设置登录状态
function setSession(username) {
    localStorage.setItem(SESSION_KEY, username);
}

// 清除登录状态
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

// 简单的密码哈希（注意：纯前端不安全，仅用于本地演示）
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// 切换登录/注册标签
function switchAuthTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    document.getElementById('loginStatus').textContent = '';
    document.getElementById('registerStatus').textContent = '';

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
}

// 注册处理
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regPassword2').value;
    const statusEl = document.getElementById('registerStatus');

    if (password !== password2) {
        statusEl.textContent = '两次输入的密码不一致';
        statusEl.className = 'status-msg status-error';
        return false;
    }

    const users = getUsers();
    if (users[username]) {
        statusEl.textContent = '该用户名已被注册';
        statusEl.className = 'status-msg status-error';
        return false;
    }

    users[username] = {
        password: hashPassword(password),
        createdAt: Date.now(),
        config: {}
    };
    saveUsers(users);

    statusEl.textContent = '注册成功！正在跳转...';
    statusEl.className = 'status-msg status-success';

    setTimeout(() => {
        setSession(username);
        showMainPage(username);
    }, 800);

    return false;
}

// 登录处理
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const statusEl = document.getElementById('loginStatus');

    const users = getUsers();
    const user = users[username];

    if (!user) {
        statusEl.textContent = '用户不存在';
        statusEl.className = 'status-msg status-error';
        return false;
    }

    if (user.password !== hashPassword(password)) {
        statusEl.textContent = '密码错误';
        statusEl.className = 'status-msg status-error';
        return false;
    }

    statusEl.textContent = '登录成功！';
    statusEl.className = 'status-msg status-success';

    setTimeout(() => {
        setSession(username);
        showMainPage(username);
    }, 500);

    return false;
}

// 退出登录
function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        clearSession();
        showAuthPage();
    }
}

// 显示登录页
function showAuthPage() {
    document.getElementById('authPage').classList.remove('hidden');
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginStatus').textContent = '';
}

// 显示主页面
function showMainPage(username) {
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    document.getElementById('usernameDisplay').textContent = username;
    document.getElementById('userAvatar').textContent = username.charAt(0).toUpperCase();
    loadUserConfig(username);
}

// ===== 按用户存储配置 =====

function getUserConfigKey(username) {
    return 'dialect_config_' + username;
}

function loadUserConfig(username) {
    const key = getUserConfigKey(username);
    const data = localStorage.getItem(key);
    const config = data ? JSON.parse(data) : {};

    document.getElementById('apiKey').value = config.apiKey || '';
    document.getElementById('baseUrl').value = config.baseUrl || '';
    document.getElementById('modelName').value = config.modelName || 'qwen-turbo';
}

function saveUserConfig() {
    const username = getCurrentUser();
    if (!username) return;

    const key = getUserConfigKey(username);
    const config = {
        apiKey: document.getElementById('apiKey').value.trim(),
        baseUrl: document.getElementById('baseUrl').value.trim(),
        modelName: document.getElementById('modelName').value.trim()
    };
    localStorage.setItem(key, JSON.stringify(config));
}

// ===== 翻译功能 =====

// 切换配置面板
function toggleConfig() {
    const content = document.getElementById('configContent');
    const arrow = document.getElementById('configArrow');
    content.classList.toggle('show');
    arrow.textContent = content.classList.contains('show') ? '▲' : '▼';
}

// 更新字数统计
document.getElementById('sourceText').addEventListener('input', function() {
    document.getElementById('charCount').textContent = this.value.length;
});

// 更新源语言标签
document.getElementById('dialect').addEventListener('change', function() {
    document.getElementById('sourceLabel').textContent = dialectNames[this.value] + ' 原文';
});

// 清空
function clearAll() {
    document.getElementById('sourceText').value = '';
    document.getElementById('targetText').value = '';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('statusMsg').textContent = '';
}

// 设置状态消息
function setStatus(msg, type = '') {
    const statusEl = document.getElementById('statusMsg');
    statusEl.textContent = msg;
    statusEl.className = 'status-msg ' + (type ? 'status-' + type : '');
}

// 设置加载状态
function setLoading(loading) {
    const btn = document.getElementById('translateBtn');
    const btnIcon = document.getElementById('btnIcon');
    const btnText = document.getElementById('btnText');
    
    if (loading) {
        btn.disabled = true;
        btnIcon.innerHTML = '<span class="loading"></span>';
        btnText.textContent = '翻译中...';
    } else {
        btn.disabled = false;
        btnIcon.textContent = '✨';
        btnText.textContent = '翻译';
    }
}

// 翻译函数
async function translateText() {
    const sourceText = document.getElementById('sourceText').value.trim();
    const dialect = document.getElementById('dialect').value;
    const apiKey = document.getElementById('apiKey').value.trim();
    let baseUrl = document.getElementById('baseUrl').value.trim();
    const modelName = document.getElementById('modelName').value.trim() || 'qwen-turbo';

    if (!sourceText) {
        setStatus('请输入要翻译的文本', 'error');
        return;
    }

    if (!apiKey) {
        setStatus('请先在「API 设置」中配置百炼 API Key', 'error');
        toggleConfig();
        return;
    }

    if (!baseUrl) {
        setStatus('请先在「API 设置」中配置 Base URL（OpenAI 兼容地址）', 'error');
        toggleConfig();
        return;
    }

    // 确保 baseUrl 不以 / 结尾
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }

    saveUserConfig();
    setLoading(true);
    setStatus('');

    const dialectName = dialectNames[dialect] || '方言';
    const prompt = `你是一位专业的${dialectName}翻译专家，请将以下${dialectName}文本准确翻译成英语。

翻译原则：
忠实于原文的字面含义，不要随意增删或脑补语境
字或词，直接翻译其本义（例如：上海话"侬"=你，应译为 "you"）
句子，在准确的基础上翻得自然流畅
称代词、常用词按标准释义翻译，不要当成语气词
结果，不要添加任何解释、说明或前后缀

tName}原文：
Text}

英语翻译：`;

    try {
        const response = await fetch(baseUrl + '/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'API 请求失败 (HTTP ' + response.status + ')');
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const translation = data.choices[0].message.content.trim();
            document.getElementById('targetText').value = translation;
            setStatus('翻译完成 ✓', 'success');
        } else {
            throw new Error('返回数据格式异常');
        }

    } catch (error) {
        console.error('翻译错误:', error);
        setStatus('翻译失败：' + error.message, 'error');
    } finally {
        setLoading(false);
    }
}

// 支持回车键翻译（Ctrl+Enter）
document.getElementById('sourceText').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        translateText();
    }
});

// ===== 页面初始化 =====
function init() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // 验证用户是否还存在
        const users = getUsers();
        if (users[currentUser]) {
            showMainPage(currentUser);
            return;
        } else {
            clearSession();
        }
    }
    showAuthPage();
}

init();