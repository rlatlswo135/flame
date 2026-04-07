type PropDef = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

function PropsTable({ title, props }: { title: string; props: PropDef[] }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="overflow-x-auto rounded-lg border border-flame-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-flame-border bg-flame-bg-secondary">
              <th className="text-left px-4 py-2.5 font-medium text-flame-text-secondary">Prop</th>
              <th className="text-left px-4 py-2.5 font-medium text-flame-text-secondary">Type</th>
              <th className="text-left px-4 py-2.5 font-medium text-flame-text-secondary">
                Default
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-flame-text-secondary">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name} className="border-b border-flame-border last:border-b-0">
                <td className="px-4 py-2.5 font-mono text-flame-accent text-xs">{prop.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-flame-text-secondary">
                  {prop.type}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-flame-text-tertiary">
                  {prop.defaultValue || '-'}
                </td>
                <td className="px-4 py-2.5 text-flame-text-secondary">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { PropsTable };
export type { PropDef };
