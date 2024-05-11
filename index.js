/**
 * 代理脚本基础库
 */
class ProxyTool {
  /**
   * 网络环境的详细信息
   */
  get network() {
    const { wifi, v4, v6, dns } = $network;
    return {
      /**
       * wifi信息
       */
      wifi,
      /**
       * ipv4信息
       */
      v4,
      /**
       * ipv6信息
       */
      v6,
      /**
       * dns
       */
      dns,
    };
  }
  /**
   * 脚本信息
   */
  get script() {
    const { name, startTime, type } = $script;
    return {
      /**
       * 脚本名称
       */
      name,
      /**
       * 脚本开始的时间
       */
      startTime,
      /**
       * 脚本的类型
       */
      type,
    };
  }
  /**
   * 环境
   */
  get environment() {
    const { system, language } = $environment;
    const surgeBuild = $environment["surge-build"];
    const surgeVersion = $environment["surge-version"];
    const surgeModel = $environment["device-model"];
    return {
      /**
       * 系统: iOS | macOS
       */
      system,
      /**
       * Surge 当前的 UI 语言
       */
      language,
      /**
       * Surge版本号
       */
      surgeBuild,
      /**
       * Surge简称版本号
       */
      surgeVersion,
      /**
       * 设备型号
       */
      surgeModel,
    };
  }
  /**
   * request信息
   */
  get request() {
    const { url, method, headers, body, id } = $request;
    return {
      /**
       * 请求网址
       */
      url,
      /**
       * 请求HTTP方法
       */
      method,
      /**
       * 请求HTTP headers
       */
      headers,
      /**
       * 请求正文
       */
      body,
      /**
       * 脚本之间连续性的唯一 ID
       */
      id,
    };
  }
  /**
   * response信息，url信息需要通过request获取
   */
  get response() {
    const { status, headers, body } = $response;
    return {
      /**
       * 响应HTTP状态码
       */
      status,
      /**
       * 响应 HTTP headers
       */
      headers,
      /**
       * 响应 HTTP 正文，如果未设置二进制模式，则使用 UTF-8 解码为字符串。仅当requires-body = true时存在
       */
      body,
    };
  }
  /**
   * 执行GeoIP查找。结果位于 ISO 3166 代码中
   * @param {string} ip IP地址
   * @returns
   */
  geoip(ip) {
    return $utils.geoip(ip);
  }
  /**
   * 查找 IP 地址的 ASO
   * @param {string} ip IP地址
   * @returns
   */
  ipaso(ip) {
    return $utils.ipaso(ip);
  }
  /**
   * 解压缩 gzip 数据。结果也是一个 Uint8Array
   * @param {Uint8Array} binary
   * @returns {Uint8Array}
   */
  ungzip(binary) {
    return $utils.ungzip(binary);
  }
  /**
   * 通知
   * @param {string} title 通知标题
   * @param {string} subtitle 通知副标题
   * @param {string} body 通知内容
   * @param {object} options 选项
   *  @param {string} options.action 点击通知打开Surge后的操作 open-url.打开一个URL，具体URL由参数提供url  clipboard.将内容复制到剪贴板（将由用户确认），内容通过参数给出text
   *  @param {string} options.mediaUrl 提供通知的媒体内容，例如图像。内容应该是有效的 URL
   *  @param {string} options.mediaBase64 与上面功能相同，但是内容是直接由base64提供的。它需要通过参数提供内容的 MIME 类型media-base64-mime
   *  @param {number} options.autoDismiss 在指定的时间段（以秒为单位）后自动消除此通知，默认为 0，表示它无限期地持续
   *  @param {string} options.sound 弹出通知时使用默认的推送消息声音
   */
  notify(title, subtitle, body, options = {}) {
    $notification.post(title, subtitle, body, {
      ...options,
      "media-url": options.mediaUrl,
      "media-base64": options.mediaBase64,
      "auto-dismiss": options.autoDismiss,
    });
  }
  /**
   * 持久化存储，如果成功则返回 true
   * @param {string} key key
   * @param {string} value 值
   */
  setStorage(key, value) {
    return $persistentStore.write(value, key);
  }
  /**
   * 获取保存的数据，返回字符串或Null
   * @param {string} key key
   */
  getStorage(key) {
    return $persistentStore.read(key);
  }
  /**
   * 启动 HTTP 请求
   * @param {string} url 请求url
   * @param {string || object} data data可以是字符串或对象
   * @param {object} options 选项
   *  @param {object} options.headers 请求头
   *  @param {string} options.method 请求类型
   *  @param {number} options.timeout 默认超时时间为 5 秒。您可以使用此选项覆盖它
   *  @param {boolean} options.insecure 如果该选项设置为 true，https 请求将不会验证服务器证书
   *  @param {boolean} options.autoCookie 控制是否自动处理Cookie相关字段并存储，默认开启。如果关闭，Cookie 标头将作为普通字段传递
   *  @param {boolean} options.autoRedirect 控制遇到30x HTTP状态码时是否自动重定向请求，默认开启
   *  @param {boolean} options.binaryMode 让Surge以TypedArray而不是String形式返回响应数据
   * @returns
   */
  fetch(url, data, options = {}) {
    return new Promise((resolve, reject) => {
      $httpClient[options.method || "get"](
        {
          url,
          body: data,
          ...options,
          "auto-cookie": options.autoCookie,
          "auto-redirect": options.autoRedirect,
          "binary-mode": options.binaryMode,
        },
        (error, response, body) => {
          if (error) {
            reject(error);
          }
          resolve({ response, body });
        }
      );
    });
  }
  /**
   * 完成事件
   * @param {string || object} options 选项
   *  @param {string} options.body 完成结果
   *  @param {object} options.headers 响应 HTTP 头
   * @returns
   */
  done(options) {
    if (options) {
      if (typeof options === "string") {
        $done({ body: options });
        return;
      }
      $done(options);
      return;
    }
    $done();
  }
}
