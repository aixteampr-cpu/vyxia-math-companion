import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, BookOpen, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LESSON_CATALOG, UNIT_TITLES } from "@/lib/lesson-catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vyxia | تعلّم الرياضيات" },
      {
        name: "description",
        content: "منصة Vyxia لتعلّم الرياضيات لطلاب مدارس التكنولوجيا التطبيقية.",
      },
      { property: "og:title", content: "Vyxia | تعلّم الرياضيات" },
      {
        property: "og:description",
        content: "منهج الرياضيات للصف الأول الثانوي في مكان واحد.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const units = [1, 2, 3];

  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Vyxia، الصفحة الرئيسية">
            <img src="/vyxia-mark.svg" alt="" className="size-10" />
            <span className="text-xl font-bold text-foreground">Vyxia</span>
          </a>
          <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <GraduationCap className="size-4 text-primary" aria-hidden="true" />
            مدارس WE للتكنولوجيا التطبيقية
          </span>
        </div>
      </header>

      <section id="top" className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold text-primary">الرياضيات · الصف الأول الثانوي</p>
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              كل درس، خطوة
              <span className="text-primary"> أقرب للفهم.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              اختار موضوعك وابدأ رحلتك في الرياضيات مع Vyxia.
            </p>
            <Button asChild size="lg" className="mt-7">
              <a href="#lessons">
                تصفح الدروس
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-5 border-t border-border pt-5 md:border-r md:border-t-0 md:pb-2 md:pr-8 md:pt-0">
            <div className="flex size-12 items-center justify-center bg-secondary text-primary">
              <BookOpen className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="mt-1 text-sm text-muted-foreground">درسًا في 3 وحدات</p>
            </div>
          </div>
        </div>
      </section>

      <section id="lessons" className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">محتوى المنهج</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">دروس الرياضيات</h2>
            </div>
            <span className="text-sm text-muted-foreground">الفصل الدراسي الأول</span>
          </div>

          <div className="space-y-10">
            {units.map((unit) => {
              const lessons = LESSON_CATALOG.filter((lesson) => lesson.unit === unit);
              return (
                <section key={unit} aria-labelledby={`unit-${unit}`}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-xs font-semibold text-primary">الوحدة {unit}</span>
                    <span className="h-px flex-1 bg-border" />
                    <h3 id={`unit-${unit}`} className="text-sm font-semibold text-foreground">
                      {UNIT_TITLES[unit]}
                    </h3>
                  </div>
                  <ol className="divide-y divide-border border-y border-border">
                    {lessons.map((lesson, index) => (
                      <li key={lesson.title} className="flex items-center gap-4 py-4">
                        <span className="w-7 shrink-0 text-sm tabular-nums text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium leading-7 text-foreground">{lesson.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            صفحات الكتاب {lesson.pageStart}–{lesson.pageEnd}
                          </p>
                        </div>
                        <ArrowLeft className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Vyxia · فريق مدرسة WE Luxor</span>
          <span>تطوير Mohamed Atif · فصل A4 · إشراف Mr. Mohamed Abu Zaid</span>
        </div>
      </footer>
    </main>
  );
}