import { Card } from '@/components/Common';
import styles from '@/styles/Pages.module.scss';

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <Card title={title}>
    <ul className={styles.sectionList}>
      {items.map((it, i) => (
        <li key={i} className={styles.sectionItem}>{it}</li>
      ))}
    </ul>
  </Card>
);

export default function LibraryPage() {
  return (
    <div className={styles.libraryContainer}>
      <div className={styles.libraryHeader}>
        <h2>Resource Library</h2>
        <p>Useful phrases and structures to boost your CELPIP score.</p>
      </div>

      <div className={styles.libraryGrid}>
        <Section
          title="Sequence Connectors"
          items={[
            "First of all / Firstly / To begin with",
            "Secondly / Moreover / Furthermore",
            "Thirdly / Additionally / In addition",
            "Finally / Lastly"
          ]}
        />
        <Section
          title="Task 1: Formal Openings"
          items={[
            "Dear Mr. Smith,",
            "Dear Hiring Manager,",
            "To Whom It May Concern, (only if you don't know the title)",
            "Dear Resident,"
          ]}
        />
        <Section
          title="Task 1: Closing Lines"
          items={[
            "I look forward to hearing from you soon.",
            "Please let me know if you require any further information.",
            "I would appreciate your immediate attention to this matter.",
            "Please contact me at 555-0199 if you have questions."
          ]}
        />
        <Section
          title="Task 2: Opinion Lines"
          items={[
            "In my opinion, I would rather [Option A].",
            "I strongly recommend that we choose [Option B].",
            "I am convinced that [Option A] is the superior choice.",
            "It seems to me that [Option B] would be more beneficial."
          ]}
        />
        <Section
          title="Task 2: Giving Examples"
          items={[
            "For example, last year the city built...",
            "For instance, consider the case of...",
            "A clear example of this is...",
            "Specifically, recent studies show..."
          ]}
        />
        <Section
          title="Task 2: Conclusion"
          items={[
            "In conclusion, considering the reasons mentioned above...",
            "To summarize, I believe...",
            "All in all, despite the benefits of Option A, Option B is better."
          ]}
        />
      </div>
    </div>
  );
}
