
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isActive: 'isActive'
};

exports.Prisma.StudentProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  classId: 'classId',
  parentId: 'parentId'
};

exports.Prisma.TeacherProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId'
};

exports.Prisma.ParentProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId'
};

exports.Prisma.StaffProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  role: 'role'
};

exports.Prisma.ClassScalarFieldEnum = {
  id: 'id',
  name: 'name',
  teacherId: 'teacherId'
};

exports.Prisma.SubjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  coefficient: 'coefficient'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  isCurrent: 'isCurrent'
};

exports.Prisma.TermScalarFieldEnum = {
  id: 'id',
  name: 'name',
  sessionId: 'sessionId',
  isCurrent: 'isCurrent'
};

exports.Prisma.ResultScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  subjectId: 'subjectId',
  termId: 'termId',
  caScore: 'caScore',
  examScore: 'examScore',
  total: 'total',
  grade: 'grade'
};

exports.Prisma.AssessmentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  type: 'type',
  subjectId: 'subjectId',
  classId: 'classId',
  teacherId: 'teacherId',
  dueDate: 'dueDate',
  token: 'token',
  maxScore: 'maxScore',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuestionScalarFieldEnum = {
  id: 'id',
  assessmentId: 'assessmentId',
  type: 'type',
  text: 'text',
  options: 'options',
  correctAnswer: 'correctAnswer',
  points: 'points',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubmissionScalarFieldEnum = {
  id: 'id',
  assessmentId: 'assessmentId',
  studentId: 'studentId',
  content: 'content',
  score: 'score',
  gradedById: 'gradedById',
  status: 'status',
  submittedAt: 'submittedAt'
};

exports.Prisma.WalletScalarFieldEnum = {
  id: 'id',
  parentId: 'parentId',
  balance: 'balance',
  virtualAccount: 'virtualAccount'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  walletId: 'walletId',
  amount: 'amount',
  type: 'type',
  reference: 'reference',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.AnnouncementScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  authorId: 'authorId',
  classId: 'classId',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  content: 'content',
  senderId: 'senderId',
  recipientId: 'recipientId',
  createdAt: 'createdAt'
};

exports.Prisma.AttendanceScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  date: 'date',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.TimetableEntryScalarFieldEnum = {
  id: 'id',
  classId: 'classId',
  subjectId: 'subjectId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  room: 'room',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  ACCOUNTANT: 'ACCOUNTANT',
  HR: 'HR',
  MEDICAL: 'MEDICAL',
  SECURITY: 'SECURITY'
};

exports.AssessmentType = exports.$Enums.AssessmentType = {
  ASSIGNMENT: 'ASSIGNMENT',
  PROJECT: 'PROJECT',
  TEST: 'TEST',
  EXAM: 'EXAM'
};

exports.QuestionType = exports.$Enums.QuestionType = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  THEORY: 'THEORY'
};

exports.SubmissionStatus = exports.$Enums.SubmissionStatus = {
  PENDING: 'PENDING',
  GRADED: 'GRADED',
  LATE: 'LATE'
};

exports.Prisma.ModelName = {
  User: 'User',
  StudentProfile: 'StudentProfile',
  TeacherProfile: 'TeacherProfile',
  ParentProfile: 'ParentProfile',
  StaffProfile: 'StaffProfile',
  Class: 'Class',
  Subject: 'Subject',
  Session: 'Session',
  Term: 'Term',
  Result: 'Result',
  Assessment: 'Assessment',
  Question: 'Question',
  Submission: 'Submission',
  Wallet: 'Wallet',
  Transaction: 'Transaction',
  Announcement: 'Announcement',
  Message: 'Message',
  Attendance: 'Attendance',
  TimetableEntry: 'TimetableEntry'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
