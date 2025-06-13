import { message } from 'antd';

// 请求配置接口：扩展自 RequestInit，添加自定义配置项
interface RequestConfig extends RequestInit {
  params?: Record<string, any>; // URL参数对象
  timeout?: number; // 请求超时时间（毫秒）
}

// 响应数据接口：定义后端返回的数据结构
interface ResponseData<T = any> {
  code: number; // 状态码：0表示成功，非0表示失败
  data: T; // 响应数据：泛型T表示具体的数据类型
  message: string; // 响应消息：成功或失败的提示信息
}

// 请求错误接口：扩展自Error，添加自定义错误属性
interface RequestError extends Error {
  code?: number; // 业务错误码
  status?: number; // HTTP状态码
  type?: 'timeout' | 'abort' | 'error'; // 错误类型
}

class Request {
  private baseURL: string; // 基础URL：所有请求都会基于这个URL
  private timeout: number; // 默认超时时间：10秒
  private controller: AbortController | null = null; // 请求取消控制器
  private timeoutId: NodeJS.Timeout | null = null; // 超时定时器

  constructor(baseURL: string = '', timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // 处理请求URL：拼接基础URL和查询参数
  private handleURL(url: string, params?: Record<string, any>): string {
    const fullURL = `${this.baseURL}${url}`; // 拼接完整URL
    if (!params) return fullURL; // 如果没有参数，直接返回完整URL

    // 将参数对象转换为查询字符串
    const queryString = Object.entries(params)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`, // 对参数进行URL编码
      )
      .join('&'); // 用&连接所有参数
    return `${fullURL}${fullURL.includes('?') ? '&' : '?'}${queryString}`; // 根据URL是否已有参数决定使用?还是&
  }

  // 设置超时处理
  private setupTimeout(timeout: number): void {
    // 清除可能存在的旧定时器
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // 设置新的超时定时器
    this.timeoutId = setTimeout(() => {
      this.cancel(); // 超时时取消请求
      const error: RequestError = new Error('请求超时');
      error.type = 'timeout';
      this.handleError(error);
    }, timeout);
  }

  // 清除超时定时器
  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  // 处理请求配置：设置请求头和取消信号
  private handleConfig(config: RequestConfig): RequestConfig {
    const { params, timeout, ...rest } = config; // 解构配置，分离params和timeout

    // 创建新的AbortController实例，用于取消请求
    this.controller = new AbortController();

    // 设置超时处理
    this.setupTimeout(timeout || this.timeout);

    return {
      ...rest, // 保留其他配置
      signal: this.controller.signal, // 设置取消信号
      headers: {
        'Content-Type': 'application/json', // 设置默认请求头
        ...rest.headers, // 合并自定义请求头
      },
    };
  }

  // 处理响应数据：检查响应状态和业务状态
  private async handleResponse<T>(response: Response): Promise<T> {
    // 清除超时定时器
    this.clearTimeout();

    // 检查HTTP状态码
    if (!response.ok) {
      const error: RequestError = new Error('请求失败');
      error.status = response.status;
      error.type = 'error';
      throw error;
    }

    // 解析响应数据
    const data: ResponseData<T> = await response.json();

    // 检查业务状态码
    if (data.code !== 0) {
      const error: RequestError = new Error(data.message || '请求失败');
      error.code = data.code;
      error.type = 'error';
      throw error;
    }

    return data.data; // 返回业务数据
  }

  // 取消请求方法
  public cancel(): void {
    if (this.controller) {
      this.controller.abort(); // 发送取消信号
      this.controller = null;
    }
    // 清除超时定时器
    this.clearTimeout();
  }

  // GET请求方法
  public async get<T = any>(
    url: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const { params, ...rest } = config; // 分离URL参数和其他配置
    const finalURL = this.handleURL(url, params); // 处理完整URL
    const finalConfig = this.handleConfig(rest); // 处理请求配置

    try {
      const response = await fetch(finalURL, {
        ...finalConfig,
        method: 'GET', // 设置请求方法为GET
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // POST请求方法
  public async post<T = any>(
    url: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<T> {
    const finalURL = this.handleURL(url, config.params);
    const finalConfig = this.handleConfig(config);

    try {
      const response = await fetch(finalURL, {
        ...finalConfig,
        method: 'POST', // 设置请求方法为POST
        body: data ? JSON.stringify(data) : undefined, // 将数据转换为JSON字符串
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PUT请求方法
  public async put<T = any>(
    url: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<T> {
    const finalURL = this.handleURL(url, config.params);
    const finalConfig = this.handleConfig(config);

    try {
      const response = await fetch(finalURL, {
        ...finalConfig,
        method: 'PUT', // 设置请求方法为PUT
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // DELETE请求方法
  public async delete<T = any>(
    url: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const finalURL = this.handleURL(url, config.params);
    const finalConfig = this.handleConfig(config);

    try {
      const response = await fetch(finalURL, {
        ...finalConfig,
        method: 'DELETE', // 设置请求方法为DELETE
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // 错误处理方法
  private handleError(error: any): void {
    // 清除超时定时器
    this.clearTimeout();

    if (error.name === 'AbortError') {
      message.warning('请求已取消'); // 显示请求取消提示
      return;
    }

    // 根据错误类型显示不同的错误信息
    const errorMessage =
      error.type === 'timeout'
        ? '请求超时，请稍后重试'
        : error.message || '请求失败';

    message.error(errorMessage); // 显示错误提示
  }
}

// 创建请求实例：使用环境变量中的API基础URL
const request = new Request(process.env.NEXT_PUBLIC_API_BASE_URL);

export default request;
