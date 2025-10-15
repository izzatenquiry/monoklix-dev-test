import React from 'react';
import { CheckCircleIcon, XIcon } from '../Icons';
import { type Language } from '../../types';
import { getTranslations } from '../../services/translations';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
        <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4 sm:text-2xl">{title}</h3>
        <div className="space-y-4 text-neutral-600 dark:text-neutral-300">{children}</div>
    </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-6">
        <h4 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-2">{title}</h4>
        <div className="space-y-3 text-sm leading-relaxed">{children}</div>
    </div>
);

interface GetStartedViewProps {
    language: Language;
}

const GetStartedView: React.FC<GetStartedViewProps> = ({ language }) => {
    const T = getTranslations(language).getStartedPage;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-left mb-10">
                <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
                    {T.mainTitle}
                </h1>
                <p className="mt-3 text-lg text-neutral-500 dark:text-neutral-400">
                    {T.mainSubtitle}
                </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-lg shadow-lg">
                <Section title={T.chapter1.title}>
                    <SubSection title={T.chapter1.sub1_1_title}>
                        <p>{T.chapter1.sub1_1_p1}</p>
                        <ol className="list-decimal pl-5 space-y-1">
                            {T.chapter1.sub1_1_ol.map((item, i) => <li key={i}>{item}</li>)}
                        </ol>
                    </SubSection>
                    <SubSection title={T.chapter1.sub1_2_title}>
                        <p>{T.chapter1.sub1_2_p1}</p>
                        <div className="mt-4 space-y-6">
                            <div className="p-4 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                                <h5 className="font-bold">{T.chapter1.sub1_2_option1_title}</h5>
                                <p className="text-xs mt-1">{T.chapter1.sub1_2_option1_p1}</p>
                                <ol className="list-decimal pl-5 space-y-1 mt-3">
                                    {T.chapter1.sub1_2_option1_ol.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/Google AI Studio/g, '<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">Google AI Studio</a>') }} />)}
                                </ol>
                                <h6 className="font-semibold text-sm mt-4">{T.chapter1.sub1_2_option1_video_title}</h6>
                                <div className="aspect-video mt-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                    <video
                                        className="w-full h-full"
                                        src="https://monoklix.com/wp-content/uploads/2025/09/Cara-Untuk-Dapatkan-API-Key.mp4"
                                        controls
                                        playsInline
                                        title="Cara Setup API Key MONOklix.com"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                            <div className="p-4 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                                <h5 className="font-bold">{T.chapter1.sub1_2_option2_title}</h5>
                                <p className="text-xs mt-1">{T.chapter1.sub1_2_option2_p1}</p>
                                <ol className="list-decimal pl-5 space-y-1 mt-3">
                                    {T.chapter1.sub1_2_option2_ol.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/Settings > API & Integrations/g, '<strong class="font-semibold">Settings > API & Integrations</strong>').replace(/Request a New API Key/g, '<strong class="font-semibold">Request a New API Key</strong>') }}/>)}
                                </ol>
                            </div>
                        </div>
                        <p className="mt-4">{T.chapter1.sub1_2_p2}</p>
                    </SubSection>
                </Section>
                
                <Section title={T.chapter2.title}>
                    <p>{T.chapter2.p1}</p>
                     <ul className="list-disc pl-5 space-y-2">
                        {T.chapter2.ul.map((item, i) => <li key={i}><strong className="font-semibold">{item.split(':')[0]}:</strong>{item.split(':').slice(1).join(':')}</li>)}
                    </ul>
                </Section>
                
                <Section title={T.chapter3.title}>
                    <p>{T.chapter3.p1}</p>
                    <div className="space-y-3 mt-4">
                        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
                            <div>
                                <strong className="font-semibold text-green-800 dark:text-green-300">{T.chapter3.canDoTitle}</strong>
                                <ul className="list-disc pl-5 text-sm">
                                    {T.chapter3.canDo.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                         <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <XIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
                             <div>
                                <strong className="font-semibold text-red-800 dark:text-red-300">{T.chapter3.dontTitle}</strong>
                                <ul className="list-disc pl-5 text-sm">
                                    {T.chapter3.dont.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                     <SubSection title={T.chapter3.safetyFilterTitle}>
                        <p>{T.chapter3.safetyFilterP1}</p>
                         <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="font-semibold">{T.chapter3.safetyFilterUl[0].split(':')[0]}:</strong>{T.chapter3.safetyFilterUl[0].split(':').slice(1).join(':')}</li>
                            <li><strong className="font-semibold">{T.chapter3.safetyFilterUl[1].split(':')[0]}:</strong>{T.chapter3.safetyFilterUl[1].split(':').slice(1).join(':')}
                                <ol className="list-decimal pl-5 mt-1">
                                    {T.chapter3.safetyFilterOl.map((item, i) => <li key={i}>{item}</li>)}
                                </ol>
                            </li>
                        </ul>
                        <p>{T.chapter3.safetyFilterConclusion}</p>
                    </SubSection>
                </Section>

                <Section title={T.chapter4.title}>
                    <p>{T.chapter4.p1}</p>
                    <SubSection title={T.chapter4.sub4_1_title}><p>{T.chapter4.sub4_1_p1}</p><p>{T.chapter4.sub4_1_p2}</p></SubSection>
                    <SubSection title={T.chapter4.sub4_2_title}><p>{T.chapter4.sub4_2_p1}</p><p>{T.chapter4.sub4_2_p2}</p></SubSection>
                    <SubSection title={T.chapter4.sub4_3_title}><p>{T.chapter4.sub4_3_p1}</p><p>{T.chapter4.sub4_3_p2}</p></SubSection>
                    <SubSection title={T.chapter4.sub4_4_title}><p>{T.chapter4.sub4_4_p1}</p><p>{T.chapter4.sub4_4_p2}</p></SubSection>
                </Section>
                
                <Section title={T.chapter5.title}>
                    <p>{T.chapter5.p1}</p>
                    <SubSection title={T.chapter5.sub5_1_title}>
                        <p>{T.chapter5.sub5_1_p1}</p>
                        <ul className="list-disc pl-5 space-y-1">
                            {T.chapter5.sub5_1_ul.map((item, i) => <li key={i}><strong className="font-semibold">{item.split(':')[0]}:</strong>{item.split(':').slice(1).join(':')}</li>)}
                        </ul>
                    </SubSection>
                    <SubSection title={T.chapter5.sub5_2_title}><p>{T.chapter5.sub5_2_p1}</p><p>{T.chapter5.sub5_2_p2}</p></SubSection>
                    <SubSection title={T.chapter5.sub5_3_title}>
                        <p>{T.chapter5.sub5_3_p1}</p><p>{T.chapter5.sub5_3_p2}</p>
                        <ol className="list-decimal pl-5 space-y-1">{T.chapter5.sub5_3_ol.map((item, i) => <li key={i}>{item}</li>)}</ol>
                    </SubSection>
                    <SubSection title={T.chapter5.sub5_4_title}><p>{T.chapter5.sub5_4_p1}</p><p>{T.chapter5.sub5_4_p2}</p></SubSection>
                    <SubSection title={T.chapter5.sub5_5_title}><p>{T.chapter5.sub5_5_p1}</p><p>{T.chapter5.sub5_5_p2}</p></SubSection>
                </Section>

                <Section title={T.chapter6.title}>
                    <p>{T.chapter6.p1}</p>
                    <SubSection title={T.chapter6.sub6_1_title}><p>{T.chapter6.sub6_1_p1}</p><p>{T.chapter6.sub6_1_p2}</p><p>{T.chapter6.sub6_1_p3}</p></SubSection>
                    <SubSection title={T.chapter6.sub6_2_title}>
                        <p>{T.chapter6.sub6_2_p1}</p><p className="font-semibold">{T.chapter6.sub6_2_p2}</p>
                        <ol className="list-decimal pl-5 space-y-1">
                            {T.chapter6.sub6_2_ol.map((item, i) => <li key={i}><strong className="font-semibold">{item.split(':')[0]}:</strong>{item.split(':').slice(1).join(':')}</li>)}
                        </ol>
                    </SubSection>
                    <SubSection title={T.chapter6.sub6_3_title}><p>{T.chapter6.sub6_3_p1}</p><p>{T.chapter6.sub6_3_p2}</p></SubSection>
                    <SubSection title={T.chapter6.sub6_4_title}><p>{T.chapter6.sub6_4_p1}</p><p>{T.chapter6.sub6_4_p2}</p></SubSection>
                </Section>

                <Section title={T.chapter7.title}>
                    <p>{T.chapter7.p1}</p>
                    <SubSection title={T.chapter7.sub7_1_title}>
                        <p>{T.chapter7.sub7_1_p1}</p>
                        <ol className="list-decimal pl-5 space-y-1">{T.chapter7.sub7_1_ol.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ol>
                        <p className="mt-2">{T.chapter7.sub7_1_p2}</p>
                    </SubSection>
                </Section>
                
                <Section title={T.chapter8.title}>
                    <SubSection title={T.chapter8.sub8_1_title}><p>{T.chapter8.sub8_1_p1}</p><p>{T.chapter8.sub8_1_p2}</p></SubSection>
                    <SubSection title={T.chapter8.sub8_2_title}><p>{T.chapter8.sub8_2_p1}</p><p>{T.chapter8.sub8_2_p2}</p></SubSection>
                </Section>
                
                <Section title={T.chapter9.title}>
                    <SubSection title={T.chapter9.sub9_1_title}><p>{T.chapter9.sub9_1_p1}</p></SubSection>
                    <SubSection title={T.chapter9.sub9_2_title}>
                        <ul className="list-disc pl-5 space-y-1">
                            {T.chapter9.sub9_2_ul.map((item, i) => <li key={i}><strong className="font-semibold">{item.split(':')[0]}:</strong>{item.split(':').slice(1).join(':')}</li>)}
                        </ul>
                    </SubSection>
                    <SubSection title={T.chapter9.sub9_3_title}><p>{T.chapter9.sub9_3_p1}</p></SubSection>
                    <SubSection title={T.chapter9.sub9_4_title}><p>{T.chapter9.sub9_4_p1}</p></SubSection>
                </Section>

                <Section title={T.chapter10.title}>
                    <p>{T.chapter10.p1}</p>
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="text-xs text-neutral-700 uppercase bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400">
                                <tr>
                                    <th scope="col" className="px-4 py-3 border border-neutral-300 dark:border-neutral-700 w-1/6">Error Code</th>
                                    <th scope="col" className="px-4 py-3 border border-neutral-300 dark:border-neutral-700 w-2/5">Problem & Main Cause</th>
                                    <th scope="col" className="px-4 py-3 border border-neutral-300 dark:border-neutral-700 w-2/5">Solution</th>
                                </tr>
                            </thead>
                            <tbody>
                                {T.chapter10.table.map((row, index) => (
                                    <tr key={index} className="border-b dark:border-neutral-800">
                                        <td className="px-4 py-4 font-mono border border-neutral-300 dark:border-neutral-700 align-top" dangerouslySetInnerHTML={{ __html: row.code }}></td>
                                        <td className="px-4 py-4 border border-neutral-300 dark:border-neutral-700 align-top" dangerouslySetInnerHTML={{ __html: row.problem }}></td>
                                        <td className="px-4 py-4 border border-neutral-300 dark:border-neutral-700 align-top" dangerouslySetInnerHTML={{ __html: row.solution }}></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                <Section title={T.chapter11.title}>
                    <p>{T.chapter11.p1}</p>
                    <p>{T.chapter11.p2}</p>
                    
                    <SubSection title={T.chapter11.sub11_1_title}>
                        <p>{T.chapter11.sub11_1_p1}</p>
                        <ul className="list-disc pl-5 space-y-1">
                            {T.chapter11.sub11_1_ul.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}
                        </ul>
                    </SubSection>

                    <SubSection title={T.chapter11.sub11_2_title}>
                        <ul className="list-disc pl-5 space-y-2">
                            {T.chapter11.sub11_2_ul.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/`([^`]+)`/g, '<code class="text-sm font-mono bg-neutral-200 dark:bg-neutral-700 p-1 rounded">$1</code>') }} />)}
                        </ul>
                    </SubSection>

                    <SubSection title={T.chapter11.sub11_3_title}>
                        <p>{T.chapter11.sub11_3_p1}</p>
                        <div className="mt-6 overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="text-xs text-neutral-700 uppercase bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 border border-neutral-300 dark:border-neutral-700">{T.chapter11.tableHeaders.category}</th>
                                        <th scope="col" className="px-4 py-3 border border-neutral-300 dark:border-neutral-700">{T.chapter11.tableHeaders.model}</th>
                                        <th scope="col" className="px-4 py-3 border border-neutral-300 dark:border-neutral-700">{T.chapter11.tableHeaders.cost}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {T.chapter11.table.map((row, index) => (
                                        <tr key={index} className="border-b dark:border-neutral-800">
                                            <td className="px-4 py-4 border border-neutral-300 dark:border-neutral-700 align-top">{row.category}</td>
                                            <td className="px-4 py-4 border border-neutral-300 dark:border-neutral-700 align-top"><code className="text-sm font-mono bg-neutral-200 dark:bg-neutral-700 p-1 rounded">{row.model}</code></td>
                                            <td className="px-4 py-4 border border-neutral-300 dark:border-neutral-700 align-top">{row.cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SubSection>

                    <SubSection title={T.chapter11.sub11_4_title}>
                        <ul className="list-disc pl-5 space-y-1">
                            {T.chapter11.sub11_4_ul.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                        <p className="mt-3" dangerouslySetInnerHTML={{ __html: T.chapter11.sub11_4_p2.replace(/AI Support/g, '<strong class="font-semibold">AI Support</strong>') }} />
                    </SubSection>
                </Section>


                 <div className="text-center mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="font-semibold">{T.chapter12.title}</p>
                </div>
            </div>
        </div>
    );
};

export default GetStartedView;