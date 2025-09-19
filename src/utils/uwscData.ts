import * as fs from 'fs';
import * as path from 'path';

export interface UWSCKeywordLists {
    keywords: string[];
    constants: string[];
    specialVars: string[];
    declarations: string[];
}

export interface UWSCFunctionParameter {
    name: string;
    type: string;
    description: string;
    optional?: boolean;
}

export interface UWSCFunctionReturn {
    type: string;
    description?: string;
}

export interface UWSCFunctionDefinition {
    description: string;
    parameters?: UWSCFunctionParameter[];
    returns?: UWSCFunctionReturn;
}

export type UWSCKeywordCategory = 'keyword' | 'constant' | 'specialVar' | 'declaration';

export interface UWSCKeywordInfo {
    name: string;
    category: UWSCKeywordCategory;
}

interface UWSCFunctionJson {
    [name: string]: UWSCFunctionDefinition;
}

const keywordCategoryLabels: Record<UWSCKeywordCategory, string> = {
    keyword: '制御構文',
    constant: '組み込み定数',
    specialVar: '特殊変数',
    declaration: '宣言キーワード'
};

function readJsonFile<T>(fileName: string): T {
    const candidatePaths = [
        path.join(__dirname, '..', 'data', fileName),
        path.join(__dirname, '..', '..', 'data', fileName)
    ];

    for (const candidate of candidatePaths) {
        if (fs.existsSync(candidate)) {
            const json = fs.readFileSync(candidate, 'utf-8');
            return JSON.parse(json) as T;
        }
    }

    throw new Error(`Unable to locate data file: ${fileName}`);
}

function normalizeName(name: string): string {
    return name.toUpperCase();
}

const keywordData = readJsonFile<UWSCKeywordLists>('keywords.json');
const functionData = readJsonFile<UWSCFunctionJson>('functions.json');

export const keywordInfos = new Map<string, UWSCKeywordInfo>();

(['keywords', 'constants', 'specialVars', 'declarations'] as const).forEach((categoryKey) => {
    const category = categoryKey as UWSCKeywordCategory;
    keywordData[categoryKey]?.forEach((name) => {
        keywordInfos.set(normalizeName(name), {
            name,
            category
        });
    });
});

export const keywordList = Array.from(keywordInfos.values()).map((info) => ({
    ...info,
    label: keywordCategoryLabels[info.category]
}));

export const functionInfos = new Map<string, UWSCFunctionDefinition>();
export const functionList = Object.entries(functionData).map(([name, definition]) => {
    const normalizedName = normalizeName(name);
    functionInfos.set(normalizedName, definition);
    return { name: normalizedName, definition };
});

export function getKeywordInfo(name: string): (UWSCKeywordInfo & { label: string }) | undefined {
    const info = keywordInfos.get(normalizeName(name));
    if (!info) {
        return undefined;
    }

    return {
        ...info,
        label: keywordCategoryLabels[info.category]
    };
}

export function getFunctionInfo(name: string): UWSCFunctionDefinition | undefined {
    return functionInfos.get(normalizeName(name));
}

export function buildFunctionSignature(name: string, definition: UWSCFunctionDefinition): string {
    const parameters = definition.parameters ?? [];
    const parameterLabels = parameters.map((parameter) => {
        const typeInfo = parameter.type ? `: ${parameter.type}` : '';
        const label = `${parameter.name}${typeInfo}`;
        return parameter.optional ? `[${label}]` : label;
    });
    return `${name}(${parameterLabels.join(', ')})`;
}

export function buildFunctionMarkdown(name: string, definition: UWSCFunctionDefinition): string {
    const lines: string[] = [];
    lines.push(`**${name}**`);
    lines.push('');
    lines.push(definition.description);

    const parameters = definition.parameters ?? [];
    if (parameters.length > 0) {
        lines.push('');
        lines.push('#### 引数');
        parameters.forEach((parameter) => {
            const optionalMark = parameter.optional ? ' (省略可能)' : '';
            const typeInfo = parameter.type ? ` (${parameter.type})` : '';
            lines.push(`- \`${parameter.name}\`${typeInfo}${optionalMark}: ${parameter.description}`);
        });
    }

    if (definition.returns) {
        const returns = definition.returns;
        lines.push('');
        lines.push('#### 戻り値');
        const segments: string[] = [];
        if (returns.type) {
            segments.push(`(${returns.type})`);
        }
        if (returns.description) {
            segments.push(returns.description);
        }
        if (segments.length > 0) {
            lines.push(`- ${segments.join(' ')}`);
        }
    }

    return lines.join('\n');
}
