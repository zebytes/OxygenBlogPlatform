---
title: "TypeScript 最佳实践"
date: "2024-01-05"
category: "编程语言"
tags: ["TypeScript", "JavaScript", "最佳实践"]
readTime: 10
excerpt: "掌握 TypeScript 开发的最佳实践，提升代码质量和开发效率。"
---

# TypeScript 最佳实践

TypeScript 已经成为现代前端开发的标准选择。本文将分享一些 TypeScript 开发中的最佳实践，帮助你写出更安全、更可维护的代码。

## 类型定义最佳实践

### 1. 优先使用接口而非类型别名

```typescript
// ✅ 推荐：使用接口
interface User {
  id: number
  name: string
  email: string
  createdAt: Date
}

// ❌ 避免：对于对象类型使用类型别名
type User = {
  id: number
  name: string
  email: string
  createdAt: Date
}

// ✅ 类型别名适用于联合类型
type Status = 'pending' | 'approved' | 'rejected'
type Theme = 'light' | 'dark'
```

### 2. 使用严格的类型检查

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true
  }
}
```

### 3. 合理使用泛型

```typescript
// ✅ 好的泛型使用
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

interface Repository<T> {
  findById(id: string): Promise<T | null>
  create(entity: Omit<T, 'id'>): Promise<T>
  update(id: string, updates: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // 实现逻辑
    return null
  }
  
  async create(userData: Omit<User, 'id'>): Promise<User> {
    // 实现逻辑
    return {} as User
  }
  
  // ... 其他方法
}

// ❌ 避免过度复杂的泛型
interface ComplexGeneric<T, U, V, W extends keyof T> {
  // 过于复杂，难以理解和维护
}
```

## 函数和方法最佳实践

### 1. 明确的函数签名

```typescript
// ✅ 清晰的函数签名
interface CreateUserParams {
  name: string
  email: string
  age?: number
}

interface CreateUserResult {
  user: User
  success: boolean
  errors?: string[]
}

async function createUser(
  params: CreateUserParams
): Promise<CreateUserResult> {
  try {
    const user = await userService.create(params)
    return { user, success: true }
  } catch (error) {
    return {
      user: {} as User,
      success: false,
      errors: [error.message]
    }
  }
}

// ❌ 避免：参数过多且类型不明确
function createUser(
  name: string,
  email: string,
  age: number,
  isActive: boolean,
  role: string,
  department: string
) {
  // 难以维护和调用
}
```

### 2. 使用函数重载

```typescript
// 函数重载示例
function formatDate(date: Date): string
function formatDate(date: string): string
function formatDate(date: number): string
function formatDate(date: Date | string | number): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  }
  if (typeof date === 'string') {
    return new Date(date).toISOString().split('T')[0]
  }
  return new Date(date).toISOString().split('T')[0]
}

// 使用示例
const formatted1 = formatDate(new Date()) // string
const formatted2 = formatDate('2024-01-01') // string
const formatted3 = formatDate(1704067200000) // string
```

## 错误处理最佳实践

### 1. 使用 Result 模式

```typescript
// 定义 Result 类型
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

// 辅助函数
function success<T>(data: T): Result<T> {
  return { success: true, data }
}

function failure<E>(error: E): Result<never, E> {
  return { success: false, error }
}

// 使用示例
async function fetchUser(id: string): Promise<Result<User, string>> {
  try {
    const response = await fetch(`/api/users/${id}`)
    
    if (!response.ok) {
      return failure(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const user = await response.json()
    return success(user)
  } catch (error) {
    return failure(`网络错误: ${error.message}`)
  }
}

// 调用示例
const result = await fetchUser('123')
if (result.success) {
  console.log('用户信息:', result.data.name)
} else {
  console.error('获取用户失败:', result.error)
}
```

### 2. 自定义错误类型

```typescript
// 定义错误基类
abstract class AppError extends Error {
  abstract readonly code: string
  abstract readonly statusCode: number
  
  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message)
    this.name = this.constructor.name
  }
}

// 具体错误类型
class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR'
  readonly statusCode = 400
}

class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND'
  readonly statusCode = 404
}

class DatabaseError extends AppError {
  readonly code = 'DATABASE_ERROR'
  readonly statusCode = 500
}

// 使用示例
function validateUser(userData: unknown): User {
  if (!userData || typeof userData !== 'object') {
    throw new ValidationError('用户数据无效', { userData })
  }
  
  const user = userData as Record<string, any>
  
  if (!user.email || typeof user.email !== 'string') {
    throw new ValidationError('邮箱地址必填', { field: 'email' })
  }
  
  return user as User
}
```

## 工具类型的高级使用

### 1. 实用工具类型

```typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// 深度可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 非空类型
type NonNullable<T> = T extends null | undefined ? never : T

// 提取函数返回类型
type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
  T extends (...args: any) => Promise<infer R> ? R : never

// 使用示例
interface Config {
  database: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
  cache: {
    ttl: number
    maxSize: number
  }
}

type ReadonlyConfig = DeepReadonly<Config>
type PartialConfig = DeepPartial<Config>

async function getUser(): Promise<User> {
  return {} as User
}

type UserType = AsyncReturnType<typeof getUser> // User
```

### 2. 条件类型和映射类型

```typescript
// 提取对象中的函数类型
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>

// 提取对象中的非函数类型
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>

// 使用示例
class UserService {
  name = 'UserService'
  version = '1.0.0'
  
  async getUser(id: string): Promise<User> {
    return {} as User
  }
  
  async createUser(userData: CreateUserParams): Promise<User> {
    return {} as User
  }
}

type ServiceMethods = FunctionProperties<UserService>
// { getUser: (id: string) => Promise<User>; createUser: (userData: CreateUserParams) => Promise<User> }

type ServiceData = NonFunctionProperties<UserService>
// { name: string; version: string }
```

## 模块和命名空间

### 1. 模块组织

```typescript
// types/user.ts
export interface User {
  id: string
  name: string
  email: string
}

export interface CreateUserRequest {
  name: string
  email: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
}

// services/user.service.ts
import type { User, CreateUserRequest, UpdateUserRequest } from '../types/user'

export class UserService {
  async getUser(id: string): Promise<User> {
    // 实现
    return {} as User
  }
  
  async createUser(request: CreateUserRequest): Promise<User> {
    // 实现
    return {} as User
  }
  
  async updateUser(id: string, request: UpdateUserRequest): Promise<User> {
    // 实现
    return {} as User
  }
}

// controllers/user.controller.ts
import { UserService } from '../services/user.service'
import type { CreateUserRequest, UpdateUserRequest } from '../types/user'

export class UserController {
  constructor(private userService: UserService) {}
  
  async createUser(request: CreateUserRequest) {
    return this.userService.createUser(request)
  }
}
```

### 2. 声明合并

```typescript
// 扩展第三方库类型
declare module 'express' {
  interface Request {
    user?: User
    requestId: string
  }
}

// 全局类型声明
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void
  }
}

// 环境变量类型
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    DATABASE_URL: string
    JWT_SECRET: string
    PORT?: string
  }
}
```

## 性能优化

### 1. 类型导入优化

```typescript
// ✅ 使用 type-only 导入
import type { User } from './types/user'
import type { ApiResponse } from './types/api'

// ✅ 混合导入
import { UserService, type CreateUserRequest } from './services/user'

// ❌ 避免：不必要的运行时导入
import { User } from './types/user' // 如果只用作类型
```

### 2. 延迟类型计算

```typescript
// 使用条件类型延迟计算
type ApiEndpoint<T extends string> = T extends `${infer Method} ${infer Path}`
  ? {
      method: Method
      path: Path
      handler: (req: Request, res: Response) => void
    }
  : never

// 只有在实际使用时才会计算类型
type GetUserEndpoint = ApiEndpoint<'GET /users/:id'>
```

## 测试中的 TypeScript

### 1. 类型安全的测试

```typescript
// test-utils.ts
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    ...overrides
  }
}

export function expectType<T>(value: T): T {
  return value
}

// user.test.ts
import { createMockUser, expectType } from './test-utils'
import { UserService } from '../services/user.service'

describe('UserService', () => {
  it('should create user with correct type', async () => {
    const userService = new UserService()
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    }
    
    const user = await userService.createUser(userData)
    
    // 类型检查
    expectType<User>(user)
    expect(user.id).toBeDefined()
    expect(user.name).toBe(userData.name)
  })
})
```

## 总结

TypeScript 最佳实践的核心原则：

1. **类型安全优先** - 使用严格的类型检查
2. **可读性** - 清晰的接口和类型定义
3. **可维护性** - 合理的模块组织和命名
4. **性能考虑** - 优化类型导入和计算
5. **错误处理** - 使用类型安全的错误处理模式

遵循这些最佳实践，可以帮助你构建更健壮、更可维护的 TypeScript 应用。记住，TypeScript 的目标是在开发时捕获错误，而不是增加复杂性。

---

*持续学习和实践是掌握 TypeScript 的关键，建议定期查看官方文档了解最新特性。*