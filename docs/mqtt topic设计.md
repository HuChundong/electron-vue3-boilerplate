# 消息
received: rpc -> bot
Processor 处理PC端消息之后，在 /msg/wxid/received topic 上发送消息
Bot 订阅 /msg/wxid/received topic，接收消息，并在界面上进行展示

send: bot -> rpc
bot处理消息之后，发送到 /msg/wxid/send topic 上
Processor 接收消息，处理之后，调用rpc发送消息


# 指令
多种渠道，发送指令到 commond/wxid/cmd topic
Processor 订阅 commond/wxid/cmd topic，接收消息，处理之后，
返回结果到 commond/wxid/data topic
客户端根据不同的指令，自己处理返回结果

cmd 设计：
1. 获取会话列表 get_sessions
2. 获取通讯录 get_contacts
3. 获取群成员 get_group_members