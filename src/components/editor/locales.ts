import type { Language } from "@/components/editor/plugins/i18n-plugin";

export type Locale = {
  typeSomething: string;
  undo: string;
  redo: string;
  blockFormatTrigger: string;
  paragraph: string;
  heading1: string;
  heading2: string;
  heading3: string;
  numberedListBlock: string;
  bulletedListBlock: string;
  checkListBlock: string;
  quote: string;
  fontFamilyPlaceholder: string;
  noMatches: string;
  addBlockBelow: string;
  clearFormatting: string;
  textFormatToolbar: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;
  alignStart: string;
  alignEnd: string;
  outdent: string;
  indent: string;
  bold: string;
  italic: string;
  underline: string;
  strikethrough: string;
  inlineCode: string;
  highlight: string;
  subscript: string;
  superscript: string;
  lowercase: string;
  uppercase: string;
  titleCase: string;
  link: string;
  insertLink: string;
  editLink: string;
  removeLink: string;
  openLink: string;
  linkUrlPlaceholder: string;
  saveLink: string;
  decreaseFontSize: string;
  increaseFontSize: string;
  fontSizeTitle: string;
  textColor: string;
  backgroundColor: string;
  switchToReadOnly: string;
  switchToEditMode: string;
  words: string;
  characters: string;
  speechToText: string;
  autocompleteSwipe: string;
  clearEditor: string;
  clearEditorDialogTitle: string;
  clearEditorDialogDescription: string;
  clear: string;
  cancel: string;
  editorMenu: string;
  menuFile: string;
  menuEdit: string;
  menuInsert: string;
  menuFormat: string;
  menuLayout: string;
  menuHelp: string;
  newDocument: string;
  importFile: string;
  exportFile: string;
  exportAs: string;
  exportLexical: string;
  exportMarkdown: string;
  exportHtml: string;
  exportPdf: string;
  exportPlainText: string;
  printDocument: string;
  deleteAllContent: string;
  cut: string;
  copy: string;
  paste: string;
  pasteAsPlainText: string;
  deleteNode: string;
  clipboardNotAllowed: string;
  selectAll: string;
  findAndReplace: string;
  tableOfContents: string;
  comments: string;
  noComments: string;
  typeComment: string;
  replyToComment: string;
  comment: string;
  delete: string;
  deleteCommentConfirm: string;
  deleteThreadConfirm: string;
  justNow: string;
  deletedComment: string;
  you: string;
  find: string;
  replace: string;
  replaceAll: string;
  previousMatch: string;
  nextMatch: string;
  matchCount: string;
  matchCase: string;
  useRegex: string;
  noResults: string;
  invalidRegex: string;
  closeFindReplace: string;
  addComment: string;
  insertImage: string;
  insertVideo: string;
  insertYoutube: string;
  youtubeUrlPlaceholder: string;
  embedYoutube: string;
  insertTweet: string;
  tweetUrlPlaceholder: string;
  embedTweet: string;
  insertFigma: string;
  figmaUrlPlaceholder: string;
  embedFigma: string;
  autoEmbedDismiss: string;
  insertTable: string;
  addTableRow: string;
  addTableColumn: string;
  deleteTableRow: string;
  deleteTableColumn: string;
  insertCodeBlock: string;
  insertEmoji: string;
  insertSpecialCharacters: string;
  insertDateTime: string;
  dateTimeToday: string;
  dateTimeTomorrow: string;
  dateTimeYesterday: string;
  dateTimeTime: string;
  insertHorizontalRule: string;
  insertCard: string;
  insertCollapsible: string;
  insertPullQuote: string;
  insertReview: string;
  insertPoll: string;
  pollQuestionPlaceholder: string;
  pollOptionPlaceholder: string;
  pollAddOption: string;
  pollRemoveOption: string;
  pollVote: string;
  pollVotes: string;
  insertEquation: string;
  equationPlaceholder: string;
  equationInline: string;
  equationInsert: string;
  insertRuby: string;
  rubyAnnotationPlaceholder: string;
  removeRuby: string;
  insertPageBreak: string;
  textAlignment: string;
  lineSpacing: string;
  textCase: string;
  pageSize: string;
  pageSizePageless: string;
  pageSizeA4: string;
  pageSizeLetter: string;
  pageSizeLegal: string;
  pageSizeTabloid: string;
  pageSizeA3: string;
  pageSizeA5: string;
  pageSizeB4: string;
  pageSizeB5: string;
  pageSizeStatement: string;
  pageSizeExecutive: string;
  pageSizeFolio: string;
  orientation: string;
  orientationPortrait: string;
  orientationLandscape: string;
  margins: string;
  marginNarrow: string;
  marginNormal: string;
  marginModerate: string;
  marginWide: string;
  columns: string;
  columnsOne: string;
  columnsTwo: string;
  columnsThree: string;
  documentation: string;
  keyboardShortcuts: string;
  reportIssue: string;
  sendFeedback: string;
  aboutEditor: string;
  shortcutAction: string;
  shortcutKeys: string;
  shortcutsHistory: string;
  shortcutsFormatting: string;
  shortcutsParagraphs: string;
  shortcutsLists: string;
};

export const locales: Record<Language, Locale> = {
  en: {
    typeSomething: "Type something...",
    undo: "Undo",
    redo: "Redo",
    blockFormatTrigger: "Format",
    paragraph: "Paragraph",
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    numberedListBlock: "Numbered List",
    bulletedListBlock: "Bulleted List",
    checkListBlock: "Check List",
    quote: "Quote",
    fontFamilyPlaceholder: "Font",
    noMatches: "No matches.",
    addBlockBelow: "Click to add below",
    clearFormatting: "Clear formatting",
    textFormatToolbar: "Text formatting",
    alignLeft: "Align left",
    alignCenter: "Align center",
    alignRight: "Align right",
    alignJustify: "Justify",
    alignStart: "Align start",
    alignEnd: "Align end",
    outdent: "Outdent",
    indent: "Indent",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    strikethrough: "Strikethrough",
    inlineCode: "Inline code",
    highlight: "Highlight",
    subscript: "Subscript",
    superscript: "Superscript",
    lowercase: "Lowercase",
    uppercase: "Uppercase",
    titleCase: "Title case",
    link: "Link",
    insertLink: "Insert link",
    editLink: "Edit link",
    removeLink: "Remove link",
    openLink: "Open link",
    linkUrlPlaceholder: "Enter a URL",
    saveLink: "Save link",
    decreaseFontSize: "Decrease font size",
    increaseFontSize: "Increase font size",
    fontSizeTitle: "Font size",
    textColor: "Text color",
    backgroundColor: "Background color",
    switchToReadOnly: "Switch to read-only mode",
    switchToEditMode: "Switch to edit mode",
    words: "words",
    characters: "characters",
    speechToText: "Speech to text",
    autocompleteSwipe: "SWIPE",
    clearEditor: "Clear editor contents",
    clearEditorDialogTitle: "Clear editor",
    clearEditorDialogDescription: "Are you sure you want to clear the editor?",
    clear: "Clear",
    cancel: "Cancel",
    editorMenu: "Editor menu",
    menuFile: "File",
    menuEdit: "Edit",
    menuInsert: "Insert",
    menuFormat: "Format",
    menuLayout: "Layout",
    menuHelp: "Help",
    newDocument: "New document",
    importFile: "Import",
    exportFile: "Export",
    exportAs: "Export as",
    exportLexical: "Lexical",
    exportMarkdown: "Markdown",
    exportHtml: "HTML",
    exportPdf: "PDF",
    exportPlainText: "Plain text",
    printDocument: "Print",
    deleteAllContent: "Delete all content",
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    pasteAsPlainText: "Paste as plain text",
    deleteNode: "Delete node",
    clipboardNotAllowed: "Not allowed to paste from clipboard.",
    selectAll: "Select all",
    findAndReplace: "Find and replace",
    tableOfContents: "Table of contents",
    comments: "Comments",
    noComments: "No comments yet",
    typeComment: "Type a comment…",
    replyToComment: "Reply…",
    comment: "Comment",
    delete: "Delete",
    deleteCommentConfirm: "Delete this comment?",
    deleteThreadConfirm: "Delete this thread?",
    justNow: "Just now",
    deletedComment: "Comment deleted",
    you: "You",
    find: "Find",
    replace: "Replace",
    replaceAll: "Replace all",
    previousMatch: "Previous match",
    nextMatch: "Next match",
    matchCount: "{current} of {total}",
    matchCase: "Match case",
    useRegex: "Use regular expression",
    noResults: "No results",
    invalidRegex: "Invalid pattern",
    closeFindReplace: "Close find and replace",
    addComment: "Add comment",
    insertImage: "Image",
    insertVideo: "Video",
    insertYoutube: "YouTube",
    youtubeUrlPlaceholder: "Paste a YouTube link",
    embedYoutube: "Embed video",
    insertTweet: "X (Twitter)",
    tweetUrlPlaceholder: "Paste an X post link",
    embedTweet: "Embed post",
    insertFigma: "Figma",
    figmaUrlPlaceholder: "Paste a Figma link",
    embedFigma: "Embed design",
    autoEmbedDismiss: "Dismiss",
    insertTable: "Table",
    addTableRow: "Add row",
    addTableColumn: "Add column",
    deleteTableRow: "Delete row",
    deleteTableColumn: "Delete column",
    insertCodeBlock: "Code block",
    insertEmoji: "Emoji",
    insertSpecialCharacters: "Special characters",
    insertDateTime: "Date & time",
    dateTimeToday: "Today",
    dateTimeTomorrow: "Tomorrow",
    dateTimeYesterday: "Yesterday",
    dateTimeTime: "Time",
    insertHorizontalRule: "Horizontal rule",
    insertCard: "Card",
    insertCollapsible: "Collapsible",
    insertPullQuote: "Pull quote",
    insertReview: "Review",
    insertPoll: "Poll",
    pollQuestionPlaceholder: "Poll question",
    pollOptionPlaceholder: "Option",
    pollAddOption: "Add option",
    pollRemoveOption: "Remove option",
    pollVote: "vote",
    pollVotes: "votes",
    insertEquation: "Equation",
    equationPlaceholder: "LaTeX expression",
    equationInline: "Inline",
    equationInsert: "Insert equation",
    insertRuby: "Ruby annotation",
    rubyAnnotationPlaceholder: "Annotation",
    removeRuby: "Remove annotation",
    insertPageBreak: "Page break",
    textAlignment: "Alignment",
    lineSpacing: "Line spacing",
    textCase: "Text case",
    pageSize: "Page size",
    pageSizePageless: "Pageless",
    pageSizeA4: "A4 (8.27 × 11.69 in)",
    pageSizeLetter: "Letter (8.5 × 11 in)",
    pageSizeLegal: "Legal (8.5 × 14 in)",
    pageSizeTabloid: "Tabloid (11 × 17 in)",
    pageSizeA3: "A3 (11.69 × 16.54 in)",
    pageSizeA5: "A5 (5.83 × 8.27 in)",
    pageSizeB4: "B4 (9.84 × 13.90 in)",
    pageSizeB5: "B5 (6.93 × 9.84 in)",
    pageSizeStatement: "Statement (5.5 × 8.5 in)",
    pageSizeExecutive: "Executive (7.25 × 10.5 in)",
    pageSizeFolio: "Folio (8.5 × 13 in)",
    orientation: "Orientation",
    orientationPortrait: "Portrait",
    orientationLandscape: "Landscape",
    margins: "Margins",
    marginNarrow: "Narrow",
    marginNormal: "Normal",
    marginModerate: "Moderate",
    marginWide: "Wide",
    columns: "Columns",
    columnsOne: "One column",
    columnsTwo: "Two columns",
    columnsThree: "Three columns",
    documentation: "Documentation",
    keyboardShortcuts: "Keyboard shortcuts",
    reportIssue: "Report issue",
    sendFeedback: "Send feedback",
    aboutEditor: "About",
    shortcutAction: "Action",
    shortcutKeys: "Shortcut",
    shortcutsHistory: "History",
    shortcutsFormatting: "Formatting",
    shortcutsParagraphs: "Paragraphs & headings",
    shortcutsLists: "Lists",
  },
  ar: {
    typeSomething: "اكتب شيئًا...",
    undo: "تراجع",
    redo: "إعادة",
    blockFormatTrigger: "تنسيق",
    paragraph: "فقرة",
    heading1: "عنوان ١",
    heading2: "عنوان ٢",
    heading3: "عنوان ٣",
    numberedListBlock: "قائمة مرقمة",
    bulletedListBlock: "قائمة نقطية",
    checkListBlock: "قائمة مهام",
    quote: "اقتباس",
    fontFamilyPlaceholder: "الخط",
    noMatches: "لا توجد نتائج.",
    addBlockBelow: "انقر للإضافة أدناه",
    clearFormatting: "مسح التنسيق",
    textFormatToolbar: "تنسيق النص",
    alignLeft: "محاذاة لليسار",
    alignCenter: "توسيط",
    alignRight: "محاذاة لليمين",
    alignJustify: "ضبط",
    alignStart: "محاذاة للبداية",
    alignEnd: "محاذاة للنهاية",
    outdent: "تقليل المسافة البادئة",
    indent: "زيادة المسافة البادئة",
    bold: "غامق",
    italic: "مائل",
    underline: "تسطير",
    strikethrough: "يتوسطه خط",
    inlineCode: "كود مضمن",
    highlight: "تمييز",
    subscript: "نص سفلي",
    superscript: "نص علوي",
    lowercase: "أحرف صغيرة",
    uppercase: "أحرف كبيرة",
    titleCase: "تكبير أول حرف",
    link: "رابط",
    insertLink: "إدراج رابط",
    editLink: "تعديل الرابط",
    removeLink: "إزالة الرابط",
    openLink: "فتح الرابط",
    linkUrlPlaceholder: "أدخل عنوان URL",
    saveLink: "حفظ الرابط",
    decreaseFontSize: "تصغير حجم الخط",
    increaseFontSize: "تكبير حجم الخط",
    fontSizeTitle: "حجم الخط",
    textColor: "لون الخط",
    backgroundColor: "لون الخلفية",
    switchToReadOnly: "التبديل إلى وضع القراءة فقط",
    switchToEditMode: "التبديل إلى وضع التحرير",
    words: "كلمة",
    characters: "حرف",
    speechToText: "تحويل الكلام إلى نص",
    autocompleteSwipe: "اسحب",
    clearEditor: "مسح محتوى المحرر",
    clearEditorDialogTitle: "مسح المحرر",
    clearEditorDialogDescription: "هل أنت متأكد أنك تريد مسح المحرر؟",
    clear: "مسح",
    cancel: "إلغاء",
    editorMenu: "قائمة المحرر",
    menuFile: "ملف",
    menuEdit: "تحرير",
    menuInsert: "إدراج",
    menuFormat: "تنسيق",
    menuLayout: "تخطيط",
    menuHelp: "مساعدة",
    newDocument: "مستند جديد",
    importFile: "استيراد",
    exportFile: "تصدير",
    exportAs: "تصدير كـ",
    exportLexical: "ليكسيكال",
    exportMarkdown: "ماركداون",
    exportHtml: "HTML",
    exportPdf: "PDF",
    exportPlainText: "نص عادي",
    printDocument: "طباعة",
    deleteAllContent: "حذف كل المحتوى",
    cut: "قص",
    copy: "نسخ",
    paste: "لصق",
    pasteAsPlainText: "لصق كنص عادي",
    deleteNode: "حذف العنصر",
    clipboardNotAllowed: "غير مسموح باللصق من الحافظة.",
    selectAll: "تحديد الكل",
    findAndReplace: "بحث واستبدال",
    tableOfContents: "جدول المحتويات",
    comments: "التعليقات",
    noComments: "لا توجد تعليقات بعد",
    typeComment: "اكتب تعليقًا…",
    replyToComment: "رد…",
    comment: "تعليق",
    delete: "حذف",
    deleteCommentConfirm: "هل تريد حذف هذا التعليق؟",
    deleteThreadConfirm: "هل تريد حذف هذه المحادثة؟",
    justNow: "الآن",
    deletedComment: "تم حذف التعليق",
    you: "أنت",
    find: "بحث",
    replace: "استبدال",
    replaceAll: "استبدال الكل",
    previousMatch: "النتيجة السابقة",
    nextMatch: "النتيجة التالية",
    matchCount: "{current} من {total}",
    matchCase: "مطابقة حالة الأحرف",
    useRegex: "استخدام التعبيرات النمطية",
    noResults: "لا توجد نتائج",
    invalidRegex: "نمط غير صالح",
    closeFindReplace: "إغلاق البحث والاستبدال",
    addComment: "إضافة تعليق",
    insertImage: "صورة",
    insertVideo: "فيديو",
    insertYoutube: "يوتيوب",
    youtubeUrlPlaceholder: "الصق رابط يوتيوب",
    embedYoutube: "تضمين الفيديو",
    insertTweet: "إكس (تويتر)",
    tweetUrlPlaceholder: "الصق رابط منشور إكس",
    embedTweet: "تضمين المنشور",
    insertFigma: "فيجما",
    figmaUrlPlaceholder: "الصق رابط فيجما",
    embedFigma: "تضمين التصميم",
    autoEmbedDismiss: "تجاهل",
    insertTable: "جدول",
    addTableRow: "إضافة صف",
    addTableColumn: "إضافة عمود",
    deleteTableRow: "حذف صف",
    deleteTableColumn: "حذف عمود",
    insertCodeBlock: "كتلة كود",
    insertEmoji: "رمز تعبيري",
    insertSpecialCharacters: "رموز خاصة",
    insertDateTime: "التاريخ والوقت",
    dateTimeToday: "اليوم",
    dateTimeTomorrow: "غداً",
    dateTimeYesterday: "أمس",
    dateTimeTime: "الوقت",
    insertHorizontalRule: "خط أفقي",
    insertCard: "بطاقة",
    insertCollapsible: "قائمة قابلة للطي",
    insertPullQuote: "اقتباس بارز",
    insertReview: "مراجعة",
    insertPoll: "استطلاع",
    pollQuestionPlaceholder: "سؤال الاستطلاع",
    pollOptionPlaceholder: "خيار",
    pollAddOption: "إضافة خيار",
    pollRemoveOption: "إزالة الخيار",
    pollVote: "صوت",
    pollVotes: "أصوات",
    insertEquation: "معادلة",
    equationPlaceholder: "صيغة LaTeX",
    equationInline: "ضمن السطر",
    equationInsert: "إدراج معادلة",
    insertRuby: "شرح روبي",
    rubyAnnotationPlaceholder: "الشرح",
    removeRuby: "إزالة الشرح",
    insertPageBreak: "فاصل صفحة",
    textAlignment: "المحاذاة",
    lineSpacing: "تباعد الأسطر",
    textCase: "حالة الأحرف",
    pageSize: "حجم الصفحة",
    pageSizePageless: "بدون صفحات",
    pageSizeA4: "A4 (8.27 × 11.69 بوصة)",
    pageSizeLetter: "Letter (8.5 × 11 بوصة)",
    pageSizeLegal: "Legal (8.5 × 14 بوصة)",
    pageSizeTabloid: "Tabloid (11 × 17 بوصة)",
    pageSizeA3: "A3 (11.69 × 16.54 بوصة)",
    pageSizeA5: "A5 (5.83 × 8.27 بوصة)",
    pageSizeB4: "B4 (9.84 × 13.90 بوصة)",
    pageSizeB5: "B5 (6.93 × 9.84 بوصة)",
    pageSizeStatement: "Statement (5.5 × 8.5 بوصة)",
    pageSizeExecutive: "Executive (7.25 × 10.5 بوصة)",
    pageSizeFolio: "Folio (8.5 × 13 بوصة)",
    orientation: "الاتجاه",
    orientationPortrait: "عمودي",
    orientationLandscape: "أفقي",
    margins: "الهوامش",
    marginNarrow: "ضيقة",
    marginNormal: "عادية",
    marginModerate: "متوسطة",
    marginWide: "واسعة",
    columns: "الأعمدة",
    columnsOne: "عمود واحد",
    columnsTwo: "عمودان",
    columnsThree: "ثلاثة أعمدة",
    documentation: "التوثيق",
    keyboardShortcuts: "اختصارات لوحة المفاتيح",
    reportIssue: "الإبلاغ عن مشكلة",
    sendFeedback: "إرسال ملاحظات",
    aboutEditor: "حول",
    shortcutAction: "الإجراء",
    shortcutKeys: "الاختصار",
    shortcutsHistory: "السجل",
    shortcutsFormatting: "التنسيق",
    shortcutsParagraphs: "الفقرات والعناوين",
    shortcutsLists: "القوائم",
  },
  he: {
    typeSomething: "התחל לכתוב...",
    undo: "בטל",
    redo: "בצע שוב",
    blockFormatTrigger: "עיצוב",
    paragraph: "פסקה",
    heading1: "כותרת 1",
    heading2: "כותרת 2",
    heading3: "כותרת 3",
    numberedListBlock: "רשימה ממוספרת",
    bulletedListBlock: "רשימת תבליטים",
    checkListBlock: "רשימת משימות",
    quote: "ציטוט",
    fontFamilyPlaceholder: "גופן",
    noMatches: "לא נמצאו תוצאות.",
    addBlockBelow: "לחץ להוספה מתחת",
    clearFormatting: "נקה עיצוב",
    textFormatToolbar: "עיצוב טקסט",
    alignLeft: "יישור לשמאל",
    alignCenter: "מרכוז",
    alignRight: "יישור לימין",
    alignJustify: "יישור דו-צדדי",
    alignStart: "יישור להתחלה",
    alignEnd: "יישור לסוף",
    outdent: "הקטן כניסה",
    indent: "הגדל כניסה",
    bold: "מודגש",
    italic: "נטוי",
    underline: "קו תחתון",
    strikethrough: "קו חוצה",
    inlineCode: "קוד מוטבע",
    highlight: "הדגשה",
    subscript: "כתב תחתי",
    superscript: "כתב עילי",
    lowercase: "אותיות קטנות",
    uppercase: "אותיות גדולות",
    titleCase: "אות ראשונה גדולה",
    link: "קישור",
    insertLink: "הוספת קישור",
    editLink: "עריכת קישור",
    removeLink: "הסרת קישור",
    openLink: "פתיחת קישור",
    linkUrlPlaceholder: "הזן כתובת URL",
    saveLink: "שמירת קישור",
    decreaseFontSize: "הקטן גודל גופן",
    increaseFontSize: "הגדל גודל גופן",
    fontSizeTitle: "גודל גופן",
    textColor: "צבע גופן",
    backgroundColor: "צבע רקע",
    switchToReadOnly: "עבור למצב קריאה בלבד",
    switchToEditMode: "עבור למצב עריכה",
    words: "מילים",
    characters: "תווים",
    speechToText: "המרת דיבור לטקסט",
    autocompleteSwipe: "החלק",
    clearEditor: "נקה את תוכן העורך",
    clearEditorDialogTitle: "ניקוי העורך",
    clearEditorDialogDescription: "האם אתה בטוח שברצונך לנקות את העורך?",
    clear: "נקה",
    cancel: "ביטול",
    editorMenu: "תפריט העורך",
    menuFile: "קובץ",
    menuEdit: "עריכה",
    menuInsert: "הוספה",
    menuFormat: "עיצוב",
    menuLayout: "פריסה",
    menuHelp: "עזרה",
    newDocument: "מסמך חדש",
    importFile: "ייבוא",
    exportFile: "ייצוא",
    exportAs: "ייצוא בתור",
    exportLexical: "Lexical",
    exportMarkdown: "Markdown",
    exportHtml: "HTML",
    exportPdf: "PDF",
    exportPlainText: "טקסט רגיל",
    printDocument: "הדפסה",
    deleteAllContent: "מחיקת כל התוכן",
    cut: "גזור",
    copy: "העתק",
    paste: "הדבק",
    pasteAsPlainText: "הדבק כטקסט רגיל",
    deleteNode: "מחק רכיב",
    clipboardNotAllowed: "אין הרשאה להדביק מהלוח.",
    selectAll: "בחר הכול",
    findAndReplace: "חיפוש והחלפה",
    tableOfContents: "תוכן עניינים",
    comments: "תגובות",
    noComments: "אין תגובות עדיין",
    typeComment: "כתבו תגובה…",
    replyToComment: "השיבו…",
    comment: "תגובה",
    delete: "מחיקה",
    deleteCommentConfirm: "למחוק את התגובה?",
    deleteThreadConfirm: "למחוק את השרשור?",
    justNow: "הרגע",
    deletedComment: "התגובה נמחקה",
    you: "אני",
    find: "חיפוש",
    replace: "החלפה",
    replaceAll: "החלף הכול",
    previousMatch: "התאמה קודמת",
    nextMatch: "התאמה הבאה",
    matchCount: "{current} מתוך {total}",
    matchCase: "התאמת רישיות",
    useRegex: "שימוש בביטוי רגולרי",
    noResults: "אין תוצאות",
    invalidRegex: "תבנית לא תקינה",
    closeFindReplace: "סגירת חיפוש והחלפה",
    addComment: "הוסף הערה",
    insertImage: "תמונה",
    insertVideo: "וידאו",
    insertYoutube: "יוטיוב",
    youtubeUrlPlaceholder: "הדבק קישור יוטיוב",
    embedYoutube: "הטמעת וידאו",
    insertTweet: "X (טוויטר)",
    tweetUrlPlaceholder: "הדבק קישור לפוסט X",
    embedTweet: "הטמעת פוסט",
    insertFigma: "פיגמה",
    figmaUrlPlaceholder: "הדבק קישור פיגמה",
    embedFigma: "הטמעת עיצוב",
    autoEmbedDismiss: "התעלם",
    insertTable: "טבלה",
    addTableRow: "הוספת שורה",
    addTableColumn: "הוספת עמודה",
    deleteTableRow: "מחיקת שורה",
    deleteTableColumn: "מחיקת עמודה",
    insertCodeBlock: "בלוק קוד",
    insertEmoji: "אימוג'י",
    insertSpecialCharacters: "תווים מיוחדים",
    insertDateTime: "תאריך ושעה",
    dateTimeToday: "היום",
    dateTimeTomorrow: "מחר",
    dateTimeYesterday: "אתמול",
    dateTimeTime: "שעה",
    insertHorizontalRule: "קו אופקי",
    insertCard: "כרטיס",
    insertCollapsible: "בלוק מתקפל",
    insertPullQuote: "ציטוט מודגש",
    insertReview: "ביקורת",
    insertPoll: "סקר",
    pollQuestionPlaceholder: "שאלת הסקר",
    pollOptionPlaceholder: "אפשרות",
    pollAddOption: "הוספת אפשרות",
    pollRemoveOption: "הסרת האפשרות",
    pollVote: "קול",
    pollVotes: "קולות",
    insertEquation: "משוואה",
    equationPlaceholder: "ביטוי LaTeX",
    equationInline: "בתוך השורה",
    equationInsert: "הוספת משוואה",
    insertRuby: "הערת רובי",
    rubyAnnotationPlaceholder: "הערה",
    removeRuby: "הסרת ההערה",
    insertPageBreak: "מעבר עמוד",
    textAlignment: "יישור",
    lineSpacing: "מרווח שורות",
    textCase: "רישיות טקסט",
    pageSize: "גודל עמוד",
    pageSizePageless: "ללא עמודים",
    pageSizeA4: "A4 (8.27 × 11.69 אינץ')",
    pageSizeLetter: "Letter (8.5 × 11 אינץ')",
    pageSizeLegal: "Legal (8.5 × 14 אינץ')",
    pageSizeTabloid: "Tabloid (11 × 17 אינץ')",
    pageSizeA3: "A3 (11.69 × 16.54 אינץ')",
    pageSizeA5: "A5 (5.83 × 8.27 אינץ')",
    pageSizeB4: "B4 (9.84 × 13.90 אינץ')",
    pageSizeB5: "B5 (6.93 × 9.84 אינץ')",
    pageSizeStatement: "Statement (5.5 × 8.5 אינץ')",
    pageSizeExecutive: "Executive (7.25 × 10.5 אינץ')",
    pageSizeFolio: "Folio (8.5 × 13 אינץ')",
    orientation: "כיוון",
    orientationPortrait: "לאורך",
    orientationLandscape: "לרוחב",
    margins: "שוליים",
    marginNarrow: "צרים",
    marginNormal: "רגילים",
    marginModerate: "בינוניים",
    marginWide: "רחבים",
    columns: "עמודות",
    columnsOne: "עמודה אחת",
    columnsTwo: "שתי עמודות",
    columnsThree: "שלוש עמודות",
    documentation: "תיעוד",
    keyboardShortcuts: "קיצורי מקלדת",
    reportIssue: "דווח על בעיה",
    sendFeedback: "שלח משוב",
    aboutEditor: "אודות",
    shortcutAction: "פעולה",
    shortcutKeys: "קיצור",
    shortcutsHistory: "היסטוריה",
    shortcutsFormatting: "עיצוב",
    shortcutsParagraphs: "פסקאות וכותרות",
    shortcutsLists: "רשימות",
  },
};
