// ============================================
// OpenAI 聊天机器人
// ============================================

class ChatBot {
  constructor() {
    this.apiKey = ''; // 需要用户配置
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.messages = [];
    this.isOpen = false;
    this.isLoading = false;
    
    this.init();
  }

  init() {
    // 创建聊天机器人UI
    this.createChatUI();
    
    // 从localStorage加载API密钥
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      this.apiKey = savedKey;
      this.updateAPIKeyStatus(true);
    } else {
      this.showAPIKeyPrompt();
    }
  }

  createChatUI() {
    // 创建聊天机器人容器
    const chatbot = document.createElement('div');
    chatbot.id = 'chatbot';
    chatbot.className = 'chatbot-container';
    chatbot.innerHTML = `
      <div class="chatbot-header" id="chatbotHeader">
        <span>💬 AI 助手</span>
        <button class="chatbot-toggle" id="chatbotToggle">−</button>
      </div>
      <div class="chatbot-body" id="chatbotBody">
        <div class="chatbot-messages" id="chatbotMessages">
          <div class="message bot-message">
            <div class="message-content">
              你好！我是 AI 助手，有什么可以帮助你的吗？
            </div>
          </div>
        </div>
        <div class="chatbot-input-area">
          <div class="api-key-section" id="apiKeySection" style="display: none;">
            <input type="password" id="apiKeyInput" placeholder="请输入 OpenAI API Key" />
            <button id="saveApiKey">保存</button>
            <button id="toggleApiKey">显示/隐藏</button>
          </div>
          <div class="chatbot-input-wrapper">
            <input 
              type="text" 
              id="chatbotInput" 
              placeholder="输入消息..." 
              disabled
            />
            <button id="chatbotSend" disabled>发送</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(chatbot);
    
    // 绑定事件
    this.bindEvents();
  }

  bindEvents() {
    const toggleBtn = document.getElementById('chatbotToggle');
    const sendBtn = document.getElementById('chatbotSend');
    const input = document.getElementById('chatbotInput');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const toggleApiKeyBtn = document.getElementById('toggleApiKey');
    const apiKeyInput = document.getElementById('apiKeyInput');
    
    // 切换聊天窗口
    toggleBtn.addEventListener('click', () => {
      this.toggleChat();
    });
    
    // 发送消息
    sendBtn.addEventListener('click', () => {
      this.sendMessage();
    });
    
    // 回车发送
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // 保存API密钥
    saveApiKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        this.apiKey = key;
        localStorage.setItem('openai_api_key', key);
        this.updateAPIKeyStatus(true);
        apiKeyInput.value = '';
        document.getElementById('apiKeySection').style.display = 'none';
        alert('API Key 已保存！');
      } else {
        alert('请输入有效的 API Key');
      }
    });
    
    // 切换API密钥显示
    toggleApiKeyBtn.addEventListener('click', () => {
      const input = document.getElementById('apiKeyInput');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const body = document.getElementById('chatbotBody');
    const toggleBtn = document.getElementById('chatbotToggle');
    
    if (this.isOpen) {
      body.style.display = 'flex';
      toggleBtn.textContent = '−';
    } else {
      body.style.display = 'none';
      toggleBtn.textContent = '+';
    }
  }

  showAPIKeyPrompt() {
    const apiKeySection = document.getElementById('apiKeySection');
    apiKeySection.style.display = 'block';
    this.updateAPIKeyStatus(false);
  }

  updateAPIKeyStatus(hasKey) {
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    
    if (hasKey && this.apiKey) {
      input.disabled = false;
      sendBtn.disabled = false;
      input.placeholder = '输入消息...';
    } else {
      input.disabled = true;
      sendBtn.disabled = true;
      input.placeholder = '请先配置 API Key';
    }
  }

  async sendMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message || this.isLoading) return;
    if (!this.apiKey) {
      alert('请先配置 OpenAI API Key');
      this.showAPIKeyPrompt();
      return;
    }
    
    // 添加用户消息
    this.addMessage(message, 'user');
    input.value = '';
    this.isLoading = true;
    this.updateSendButton();
    
    try {
      // 调用OpenAI API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个友好的AI助手，帮助用户解答问题。'
            },
            ...this.messages,
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }
      
      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      
      // 添加机器人回复
      this.addMessage(botMessage, 'bot');
      
      // 保存消息历史
      this.messages.push(
        { role: 'user', content: message },
        { role: 'assistant', content: botMessage }
      );
      
    } catch (error) {
      console.error('Chat error:', error);
      this.addMessage(
        `抱歉，发生了错误：${error.message}。请检查你的 API Key 是否正确，以及网络连接是否正常。`,
        'bot',
        true
      );
    } finally {
      this.isLoading = false;
      this.updateSendButton();
    }
  }

  addMessage(content, type, isError = false) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message ${isError ? 'error' : ''}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // 如果是机器人消息，添加打字效果
    if (type === 'bot' && !isError) {
      this.typewriterEffect(contentDiv, content);
    }
  }

  typewriterEffect(element, text) {
    element.textContent = '';
    let index = 0;
    const speed = 20;
    
    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  updateSendButton() {
    const sendBtn = document.getElementById('chatbotSend');
    if (this.isLoading) {
      sendBtn.textContent = '发送中...';
      sendBtn.disabled = true;
    } else {
      sendBtn.textContent = '发送';
      sendBtn.disabled = false;
    }
  }
}

// 初始化聊天机器人
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
  chatbot = new ChatBot();
});

