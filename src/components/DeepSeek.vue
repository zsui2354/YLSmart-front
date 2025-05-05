    <template>
        <div>
        <div class="sendinput">
            <input
            type="text"
            v-model="message"
            placeholder="请输入问题..."
            @keyup.enter="handleEnter"
            />
            <button v-if="isStreaming" @click="stopStreaming">停止</button>
        </div>
    
        
        <div v-if="responses.length">
            <p>
            <img id="Ava" src="http://localhost:8089/files/1745656230413-deepseek.png" alt="" />
            AI 回复：
            <template v-for="(item, index) in responses" :key="index">
                <br v-if="item === '<think>' || item === '</think>'" />
                <span v-else>{{ item }}</span>
            </template>
            </p>
        </div>
        </div>
    </template>
    
    <script>
    export default {
        data() {
        return {
            message: "",
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
            const responseStream = await fetch("http://localhost:8089/api/ai/chat", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({
                model: "deepseek-r1:8b",
                prompt: this.message,
               // stream: true
                }),
                signal: this.controller.signal
            });
    
            this.message = "";
    
            const reader = responseStream.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let chunks = "";
    
            while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            chunks += decoder.decode(value, { stream: true });

            if (chunks.includes("\n")) {
                const parts = chunks.split("\n");
                for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i].trim();
                if (part) {
                    try {
                    // 移除 'data:' 前缀
                    //console.log("原始数据 part:", part);
                    const cleanedPart = part.startsWith("data:") ? part.slice(5).trim() : part;
                    //console.log("清理后的数据 cleanedPart:", cleanedPart);
                    const jsonResponse = JSON.parse(cleanedPart);
                    console.log("解析后的 JSON:", jsonResponse);
                    const content = jsonResponse.response;
                    if (content) {
                        if (content.trim() === "<think>" || content.trim() === "</think>") {
                        this.responses.push(content.trim());
                        } else {
                        this.responses.push(content);
                        }
                    }
                    } catch (error) {
                    console.error("Error parsing JSON chunk:", error);
                    }
                }
                }
                chunks = parts[parts.length - 1]; // 保留未处理的部分
            }
            }

            } catch (error) {
            if (error.name === "AbortError") {
                console.warn("流被用户中止");
            } else {
                console.error("请求错误：", error);
            }
            } finally {
            this.isStreaming = false;
            }
        },
        handleEnter() {
            this.fetchWithStreaming();
        },
        stopStreaming() {
            if (this.controller) {
            this.controller.abort();
            this.isStreaming = false;
            }
        }
        }
    };
    </script>

    <style scoped>
    input {
        /* margin-bottom: 10px; */
        padding: 10px 10px;
        font-size: 17px;
        border-radius: 50px;
        outline: none;
        border: 1px solid #33333373;
        text-align: center;
        background-color: #ffffff;
        transition: all 0.3s ease;
        box-shadow: 0 3px 15px rgba(0, 0, 0, 0.35);
    }
    input:hover{
        box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
    }
    
    button {
        margin-left: 10px;
        padding: 15px 20px;
        background-color: #ffffff;
        border: 1px solid #3333336c;
        border-radius: 30px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    button:hover{
        background-color: #45bccc;
        color: #ffffff;
    }
    
    div {
        /* max-height: 300px; */
        overflow-y: auto;
        /* border: 1px solid #ccc; */
        padding: 10px;
        margin-top: 10px;
        position: relative;
        height: 100vh;
    }
    
    p {
        white-space: pre-wrap; /* 保证内容不超出边界 */
        word-wrap: break-word;
        font-family: monospace;
        margin: 5px 0;
        padding: 10px;
        background-color: #f7f7f7;
        border-radius: 5px;
        border-radius: 5px;
        height: 100%;
        font-size: 23px;
        text-align: start;
    }
    #Ava{
        border-radius: 100%;
        width: 70px;
        height: 70px;
    }
    .sendinput{
        /* border: 1px solid red; */
        position: fixed;
        z-index: 999;
        height: auto;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
    </style>