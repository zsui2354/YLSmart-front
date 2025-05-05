    <template>
        <div>
            <div v-if="responses.length">
                <div class="health-report-title">AI 健康报告：</div>
                <div class="health-report-content" style="text-align: start;">
                    <template v-for="(item, index) in responses" :key="index">
                        <span>{{ item }}</span>
                    </template>
                    <span v-if="isStreaming" style="color:#bbb;">（生成中...）</span>
                </div>
            </div>
            <div v-else-if="isStreaming">健康报告生成中...</div>
            <div v-else class="health-report-empty">暂无健康报告</div>
        </div>
    </template>
    
    <script>
    export default {
        props: {
            healthData: {
                type: Array,
                default: () => []
            }
        },
        data() {
        return {
            responses: [],
            controller: null, // 用于取消请求
            isStreaming: false
        };
        },
        methods: {
        async fetchWithStreaming() {
            this.responses = [];
            this.controller = new AbortController();
            this.isStreaming = true;
    
            try {
            // 自动生成健康数据描述
            let healthDesc = '';
            if (this.healthData && this.healthData.length > 0) {
                // 取全部数据，生成简要描述
                const arr = this.healthData.map(item => `日期：${item.date}，体温：${item.temperature}°C，心率：${item.heart_rate}次/分，血压：${item.blood_pressure || '无'}`)
                healthDesc = `以下是我的一组健康数据：\n${arr.join('\n')}\n请根据这些数据为我生成一份健康报告。`;
            }
            const prompt = healthDesc;
            const responseStream = await fetch("http://localhost:8089/api/ai/chat", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({
                model: "deepseek-r1:8b",
                prompt: prompt,
                }),
                signal: this.controller.signal
            });
    
            const reader = responseStream.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let buffer = "";
    
            while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunk = decoder.decode(value, { stream: true });
            console.log('[流式chunk]', chunk);
            buffer += chunk;
            // 尝试逐步解析JSON
            let tryParse = true;
            while (tryParse) {
                try {
                // 查找第一个完整的JSON对象
                let startIdx = buffer.indexOf('{');
                let endIdx = buffer.indexOf('}', startIdx);
                if (startIdx !== -1 && endIdx !== -1) {
                    const jsonStr = buffer.slice(startIdx, endIdx + 1);
                    const cleanedPart = jsonStr.startsWith("data:") ? jsonStr.slice(5).trim() : jsonStr;
                    console.log('[尝试解析]', cleanedPart);
                    const jsonResponse = JSON.parse(cleanedPart);
                    const content = jsonResponse.response;
                    if (content) {
                    this.responses.push(content);
                    console.log('[推送到responses]', content);
                    }
                    if (jsonResponse.done) {
                      this.isStreaming = false;
                      console.log('[bu i] 停止流式渲染');
                    }
                    buffer = buffer.slice(endIdx + 1);
                } else {
                    tryParse = false;
                }
                } catch (e) {
                // 不是完整JSON，等待更多数据
                tryParse = false;
                console.error('[JSON解析异常]', e, buffer);
                }
            }
            }

            } catch (error) {
            // 错误处理
            console.error('[流式fetch异常]', error);
            } finally {
            this.isStreaming = false;
            console.log('[流式结束] isStreaming:', this.isStreaming, 'responses:', this.responses);
            }
        }
        },
        watch: {
            healthData: {
                handler(newVal) {
                    if (newVal && newVal.length > 0) {
                        this.fetchWithStreaming();
                    } else {
                        this.responses = [];
                    }
                },
                immediate: true
            }
        },
        mounted() {
            if (this.healthData && this.healthData.length > 0) {
                this.fetchWithStreaming();
            }
        }
    };
    </script>

    <style scoped>
    .health-report-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #2196f3;
    }
    .health-report-content {
        background: #f8fafd;
        border-radius: 8px;
        padding: 18px 20px 12px 20px;
        font-size: 16px;
        color: #333;
        min-height: 80px;
        line-height: 1.7;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
        word-wrap: break-word;
        white-space: pre-wrap;
		max-height: 27vh;
		overflow: auto;
    }
    .health-report-empty {
        color: #bbb;
        text-align: start;
        margin: 24px 0;
    }
    </style>