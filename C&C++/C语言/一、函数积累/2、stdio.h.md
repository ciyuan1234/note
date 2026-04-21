# 一、fprintf
## 1、函数原型
```c 
int fprintf(FILE *stream, const char *format, ...);
```
## 2.参数说明
- **`FILE *stream`**：文件指针，指定输出目标
    - 输出到**文件**：传入打开的文件指针
    - 输出到**控制台**：直接用 `stdout`（标准输出）
- **`const char *format`**：格式控制字符串（和 `printf` 用法完全一致）
-  **`...`**：可变参数，对应格式符的变量列表
## 3、返回值
- 成功：返回**写入的字符总数**
- 失败：返回**负数**
## 4.用法
`fprintf` 和我们最熟悉的 `printf` 几乎一样，**唯一区别**：
- `printf` 只能输出到控制台
- `fprintf` 可以指定输出到**任意文件 / 控制台**
> 等价关系：`printf("内容");` = `fprintf(stdout, "内容");`（使用fprintf输出到控制台）
