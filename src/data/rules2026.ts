import { TrackEvaluationRule } from '../types';

export const COMPETITION_RULES_2026: TrackEvaluationRule[] = [
  {
    trackId: 'higher_education_creative',
    trackName: '高教主赛道',
    groupName: '创意组',
    totalMaxScore: 100,
    tier1Rules: [
      {
        id: 'personal_growth',
        name: '个人成长',
        maxScore: 30,
        tier2List: [
          { id: 'pg_1', name: '立德树人', maxScore: 6, description: '项目弘扬正确价值观，厚植家国情怀，恪守伦理规范，有助于培育创新精神。' },
          { id: 'pg_2', name: '调研深入', maxScore: 6, description: '扎根中国大地了解国情民情，深入社会、行业、企业、实验场所选题立项与试验论证，数据及佐证材料真实。' },
          { id: 'pg_3', name: '逻辑正确', maxScore: 6, description: '符合与课程、专业、实验、科研训练和社会实践的逻辑联系，专业知识与商业知识有效结合。' },
          { id: 'pg_4', name: '知识掌握与应用能力', maxScore: 6, description: '体现对双创所需知识与技能的娴熟掌握，解决实际问题的综合能力和高级思维。' },
          { id: 'pg_5', name: '人才培养成效', maxScore: 6, description: '充分体现新工科/新医科/新农科/新文科建设成果，产教融合、科教融汇、多学科交叉、专创融合孵化支持。' },
        ],
      },
      {
        id: 'project_innovation',
        name: '项目创新',
        maxScore: 30,
        tier2List: [
          { id: 'pi_1', name: '问题导向', maxScore: 10, description: '遵循从创意到研发、试制、生产、进入市场的创新过程，实现基础研发向应用研发跨越。' },
          { id: 'pi_2', name: '目标导向', maxScore: 10, description: '团队能够基于学科专业知识并运用各类创新的理念和范式，解决社会和市场的实际需求。' },
          { id: 'pi_3', name: '创新成效', maxScore: 10, description: '从产品、工艺流程、服务、商业模式创新等开展实践，产生高数量与高质量创新成果。' },
        ],
      },
      {
        id: 'industry_value',
        name: '产业价值',
        maxScore: 25,
        tier2List: [
          { id: 'iv_1', name: '产业认知', maxScore: 6, description: '对产业规模、增长速度、竞争格局、产业趋势、产业政策等情况充分了解，形成完备深刻认知。' },
          { id: 'iv_2', name: '市场定位', maxScore: 7, description: '具有明确目标市场定位，制定合理研发、生产、营销、财务计划，设计完整可行商业模式。' },
          { id: 'iv_3', name: '落地前景', maxScore: 6, description: '项目落地执行情况，促进区域经济发展、产业转型升级情况，盈利潜力及国际化发展潜力。' },
          { id: 'iv_4', name: '社会影响', maxScore: 6, description: '直接或间接带动就业数量与质量，对社会文明、生态文明、民生福祉等积极推动作用。' },
        ],
      },
      {
        id: 'team_collaboration',
        name: '团队协作',
        maxScore: 15,
        tier2List: [
          { id: 'tc_1', name: '团队精神', maxScore: 3, description: '明确的使命愿景，团结协作的创新精神，支撑项目成长的知识技术与经验。' },
          { id: 'tc_2', name: '团队结构', maxScore: 3, description: '组织架构、人员配置、分工协作、专业结构合理，激励制度健全，鼓励留学生参与。' },
          { id: 'tc_3', name: '团队效能', maxScore: 3, description: '团队与项目关系的真实性、紧密性，各项投入情况及创立企业的可能性。' },
          { id: 'tc_4', name: '团队资源', maxScore: 3, description: '支撑项目发展的合作伙伴等外部资源的使用以及与项目关系的情况。' },
          { id: 'tc_5', name: '团队贡献', maxScore: 3, description: '项目团队成员及指导教师在项目中的实质性贡献情况。' },
        ],
      },
    ],
    mandatoryConditions: [
      '科技成果、知识产权、财务状况、运营、荣誉奖项等材料真实、准确、有效',
      '完全符合大赛规定的申报条件与学籍资格',
      '存在弄虚作假、抄袭剽窃等违规情况一票否决',
    ],
  },
  {
    trackId: 'higher_education_startup',
    trackName: '高教主赛道',
    groupName: '创业组',
    totalMaxScore: 100,
    tier1Rules: [
      {
        id: 'personal_growth',
        name: '个人成长',
        maxScore: 25,
        tier2List: [
          { id: 'pg_s1', name: '立德树人', maxScore: 5, description: '弘扬正确价值观，厚植家国情怀，恪守伦理规范。' },
          { id: 'pg_s2', name: '调研深入', maxScore: 5, description: '扎根国情民情，调研过程完整，数据及佐证真实。' },
          { id: 'pg_s3', name: '逻辑正确', maxScore: 5, description: '专业与商业结合逻辑严密，展现创业认知塑造力。' },
          { id: 'pg_s4', name: '知识掌握与应用能力', maxScore: 5, description: '娴熟掌握商业运营与管理知识，具备高级解决问题思维。' },
          { id: 'pg_s5', name: '人才培养成效', maxScore: 5, description: '四新建设成果体现，产学研协同创新成效显著。' },
        ],
      },
      {
        id: 'project_innovation',
        name: '项目创新',
        maxScore: 30,
        tier2List: [
          { id: 'pi_s1', name: '问题导向', maxScore: 7.5, description: '从基础研发向应用研发和市场转化的完整跨越。' },
          { id: 'pi_s2', name: '目标导向', maxScore: 7.5, description: '基于专业知识解决社会和市场重大实际需求。' },
          { id: 'pi_s3', name: '创新成效', maxScore: 7.5, description: '产品、工艺、服务、模式创新，获得相应市场回报。' },
          { id: 'pi_s4', name: '发展前景', maxScore: 7.5, description: '创新战略、组织机制与制度文化协同，保持长期竞争力。' },
        ],
      },
      {
        id: 'industry_value',
        name: '产业价值',
        maxScore: 30,
        tier2List: [
          { id: 'iv_s1', name: '产业发展', maxScore: 5, description: '充分掌握产业规模、增长速度、竞争格局与政策趋势。' },
          { id: 'iv_s2', name: '经营绩效', maxScore: 5, description: '营业收入(合同订单)、利润、市场份额、纳税与投产比。' },
          { id: 'iv_s3', name: '经营管理', maxScore: 5, description: '完备的研发生产运营管理制度体系与先进管理方法。' },
          { id: 'iv_s4', name: '成长前景', maxScore: 5, description: '全方位企业发展战略，可靠的人才资金技术资源。' },
          { id: 'iv_s5', name: '财务管理', maxScore: 5, description: '融资情况、现金流稳健度、融资需求及资金使用合理性。' },
          { id: 'iv_s6', name: '社会影响', maxScore: 5, description: '带动高质量就业、区域产业升级与民生福祉推动。' },
        ],
      },
      {
        id: 'team_collaboration',
        name: '团队协作',
        maxScore: 15,
        tier2List: [
          { id: 'tc_s1', name: '团队精神', maxScore: 3, description: '明确使命愿景与独特支撑经验网络。' },
          { id: 'tc_s2', name: '团队结构', maxScore: 3, description: '清晰指挥链、合理股权结构与激励制度。' },
          { id: 'tc_s3', name: '团队效能', maxScore: 3, description: '团队投入度与核心团队成员稳定性。' },
          { id: 'tc_s4', name: '团队资源', maxScore: 3, description: '支撑公司发展的战略合作伙伴与外部资源。' },
          { id: 'tc_s5', name: '团队贡献', maxScore: 3, description: '团队成员及导师的实质性投入与贡献。' },
        ],
      },
    ],
    mandatoryConditions: [
      '企业已依法注册登记，且股权结构及法人资格符合规定',
      '财务数据及纳税证明真实可靠',
      '违规造假一票否决',
    ],
  },
  {
    trackId: 'red_youth_creative',
    trackName: '青年红色筑梦之旅',
    groupName: '创意组',
    totalMaxScore: 100,
    tier1Rules: [
      {
        id: 'personal_growth',
        name: '个人成长',
        maxScore: 30,
        tier2List: [
          { id: 'ry_pg1', name: '立德树人', maxScore: 6, description: '弘扬正确价值观，厚植红旅家国情怀。' },
          { id: 'ry_pg2', name: '调研深入', maxScore: 6, description: '深入乡村振兴、基层治理一线开展扎实调研试验。' },
          { id: 'ry_pg3', name: '逻辑正确', maxScore: 6, description: '专业知识与乡村振兴/社会治理需求紧密结合。' },
          { id: 'ry_pg4', name: '知识掌握与应用能力', maxScore: 6, description: '综合运用专业知识解决基层实际困难。' },
          { id: 'ry_pg5', name: '人才培养成效', maxScore: 6, description: '专思创深度融合，推动新农科新文科建设。' },
        ],
      },
      {
        id: 'project_innovation',
        name: '项目创新',
        maxScore: 30,
        tier2List: [
          { id: 'ry_pi1', name: '解决方法', maxScore: 7.5, description: '运用创新范式有效解决乡村或社区痛点。' },
          { id: 'ry_pi2', name: '创新成效', maxScore: 7.5, description: '产出高水平技术、产品或模式创新成果。' },
          { id: 'ry_pi3', name: '创新应用', maxScore: 7.5, description: '科研成果与文创成果在乡村社区就地转化。' },
          { id: 'ry_pi4', name: '模式创新', maxScore: 7.5, description: '创新组织机制、利益联结与资源整合模式。' },
        ],
      },
      {
        id: 'development_prospect',
        name: '发展前景',
        maxScore: 20,
        tier2List: [
          { id: 'ry_dp1', name: '基础调研', maxScore: 5, description: '全面掌握帮扶地区痛点并形成完备认知。' },
          { id: 'ry_dp2', name: '发展创意', maxScore: 5, description: '经济效益与社会效益良好平衡。' },
          { id: 'ry_dp3', name: '社会贡献', maxScore: 5, description: '带动就业、乡村产业与生态民生建设。' },
          { id: 'ry_dp4', name: '推广成效', maxScore: 5, description: '模式可复制、可推广、具备示范效应。' },
        ],
      },
      {
        id: 'team_collaboration',
        name: '团队协作',
        maxScore: 20,
        tier2List: [
          { id: 'ry_tc1', name: '团队精神', maxScore: 4, description: '扎根基层的奉献精神与明确使命。' },
          { id: 'ry_tc2', name: '团队结构', maxScore: 4, description: '多学科互补的人员构成与分工协作。' },
          { id: 'ry_tc3', name: '团队效能', maxScore: 4, description: '与基层对接紧密度与长期投入保障。' },
          { id: 'ry_tc4', name: '团队资源', maxScore: 4, description: '地方政府、合作社、企业等外部支撑网络。' },
          { id: 'ry_tc5', name: '团队贡献', maxScore: 4, description: '团队师生的实质贡献与帮扶实效。' },
        ],
      },
    ],
    mandatoryConditions: [
      '实际参与红旅活动，取得明确帮扶协议或证明',
      '材料真实有效，无虚假数据，违规一票否决',
    ],
  },
  {
    trackId: 'vocational_creative',
    trackName: '职教赛道',
    groupName: '创意组',
    totalMaxScore: 100,
    tier1Rules: [
      {
        id: 'personal_growth',
        name: '个人成长',
        maxScore: 30,
        tier2List: [
          { id: 'voc_pg1', name: '立德树人', maxScore: 6, description: '培育工匠精神与守正创新价值观。' },
          { id: 'voc_pg2', name: '调研深入', maxScore: 6, description: '深入行业生产一线与车间工位实地论证。' },
          { id: 'voc_pg3', name: '逻辑正确', maxScore: 6, description: '理实一体，专业技能与商业逻辑紧密结合。' },
          { id: 'voc_pg4', name: '知识掌握与应用能力', maxScore: 6, description: '娴熟操作技能与工艺改进应用能力。' },
          { id: 'voc_pg5', name: '人才培养成效', maxScore: 6, description: '职普融通、工学结合与能工巧匠培养。' },
        ],
      },
      {
        id: 'project_innovation',
        name: '项目创新',
        maxScore: 30,
        tier2List: [
          { id: 'voc_pi1', name: '原始创新', maxScore: 7.5, description: '具备原创性技术发明或构思。' },
          { id: 'voc_pi2', name: '培养成效', maxScore: 7.5, description: '面向大国工匠的技能与工艺创新。' },
          { id: 'voc_pi3', name: '模式创新', maxScore: 7.5, description: '校企合作模式、工学一体模式创新。' },
          { id: 'voc_pi4', name: '创新成效', maxScore: 7.5, description: '工艺改进、实用技术改进与民生应用。' },
        ],
      },
      {
        id: 'industry_value',
        name: '产业价值',
        maxScore: 25,
        tier2List: [
          { id: 'voc_iv1', name: '产业情况', maxScore: 6, description: '行业规模与岗位技能需求深刻认知。' },
          { id: 'voc_iv2', name: '市场情况', maxScore: 7, description: '清晰的细分应用场景与营销计划。' },
          { id: 'voc_iv3', name: '落地情况', maxScore: 6, description: '生产线试制与落地盈利潜力。' },
          { id: 'voc_iv4', name: '社会影响', maxScore: 6, description: '带动技能就业与产业技改升级。' },
        ],
      },
      {
        id: 'team_collaboration',
        name: '团队协作',
        maxScore: 15,
        tier2List: [
          { id: 'voc_tc1', name: '团队精神', maxScore: 3, description: '精益求精的工匠精神与协作意识。' },
          { id: 'voc_tc2', name: '团队结构', maxScore: 3, description: '技能互补与车间工段合理分工。' },
          { id: 'voc_tc3', name: '团队效能', maxScore: 3, description: '团队实际研发与试制投入度。' },
          { id: 'voc_tc4', name: '团队资源', maxScore: 3, description: '校企共建实训基地与企业导师支持。' },
          { id: 'voc_tc5', name: '团队贡献', maxScore: 3, description: '指导教师与成员现场攻坚实质贡献。' },
        ],
      },
    ],
    mandatoryConditions: [
      '学籍与职教组别资格合规',
      '材料数据真实，无抄袭剽窃',
    ],
  },
  {
    trackId: 'industry_enterprise',
    trackName: '产业命题赛道',
    groupName: '企业命题组',
    totalMaxScore: 100,
    tier1Rules: [
      {
        id: 'personal_growth',
        name: '个人成长',
        maxScore: 30,
        tier2List: [
          { id: 'ind_pg1', name: '立德树人', maxScore: 6, description: '端正价值取向与工程伦理规范。' },
          { id: 'ind_pg2', name: '调研深入', maxScore: 6, description: '深入命题企业现场调研真实痛点一手数据。' },
          { id: 'ind_pg3', name: '逻辑正确', maxScore: 6, description: '专业知识与企业工程实际问题有效耦合。' },
          { id: 'ind_pg4', name: '知识掌握与应用能力', maxScore: 6, description: '综合解决企业技术攻关难题。' },
          { id: 'ind_pg5', name: '人才培养成效', maxScore: 6, description: '产教深度融合协同育人实效。' },
        ],
      },
      {
        id: 'project_innovation',
        name: '项目创新',
        maxScore: 20,
        tier2List: [
          { id: 'ind_pi1', name: '创新理念', maxScore: 10, description: '方案先进性与解题思路突破性。' },
          { id: 'ind_pi2', name: '创新成效', maxScore: 10, description: '促进企业资源整合与研发效率倍增。' },
        ],
      },
      {
        id: 'execution_effect',
        name: '实现成效',
        maxScore: 20,
        tier2List: [
          { id: 'ind_ee1', name: '实施方案', maxScore: 7, description: '目标明确、进度规划与资源配置合理。' },
          { id: 'ind_ee2', name: '需求匹配', maxScore: 7, description: '高度契合命题指标，方案经济实用。' },
          { id: 'ind_ee3', name: '社会效益', maxScore: 6, description: '为企业带来直接经济效益与行业赋能。' },
        ],
      },
      {
        id: 'project_analysis',
        name: '项目分析',
        maxScore: 10,
        tier2List: [
          { id: 'ind_pa1', name: '需求调研', maxScore: 3.5, description: '产业趋势与市场需求深度剖析。' },
          { id: 'ind_pa2', name: '资源对接', maxScore: 3.5, description: '精准理解企业技术痛点与资源匹配。' },
          { id: 'ind_pa3', name: '解决方案', maxScore: 3, description: '解题可行性与产业适配度严谨论证。' },
        ],
      },
      {
        id: 'team_collaboration',
        name: '团队协作',
        maxScore: 20,
        tier2List: [
          { id: 'ind_tc1', name: '团队结构', maxScore: 5, description: '跨学科技术攻坚团队配置合理。' },
          { id: 'ind_tc2', name: '团队效能', maxScore: 5, description: '与企业研发团队持续合作可能性。' },
          { id: 'ind_tc3', name: '团队资源', maxScore: 5, description: '利用企业实验平台与外部资源。' },
          { id: 'ind_tc4', name: '团队贡献', maxScore: 5, description: '师生在技术攻关中的实质核心贡献。' },
        ],
      },
    ],
    mandatoryConditions: [
      '完全匹配入选命题企业的技术要求',
      '知识产权归属明确且合规无争议',
    ],
  },
];
